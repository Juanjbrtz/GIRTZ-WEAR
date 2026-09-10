import { and, eq } from "drizzle-orm";
import { getDb, getSqlClient } from "@/db";
import { orderItems, orders } from "@/db/schema";

export type PaymentState = "pending" | "paid" | "failed" | "refunded";

export async function setOrderPaymentState({
  orderId,
  paymentStatus,
  provider,
  transactionId,
}: {
  orderId: string;
  paymentStatus: PaymentState;
  provider?: string | null;
  transactionId?: string | null;
}) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new Error("Pedido no encontrado.");

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const sql = getSqlClient();

  if (order.paymentStatus === paymentStatus) {
    await db.update(orders).set({
      paymentProvider: provider || order.paymentProvider,
      paymentReference: transactionId || order.paymentReference,
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId));
    return;
  }

  if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
    await sql.transaction((txn) => [
      ...items.flatMap((item) => {
        if (!item.productId) return [];
        return [
          txn`
            WITH updated AS (
              UPDATE product_variants
              SET
                stock_quantity = COALESCE(stock_quantity, 0) - ${item.quantity},
                stock_status = CASE
                  WHEN COALESCE(stock_quantity, 0) - ${item.quantity} > 0 THEN 'available'
                  ELSE 'out_of_stock'
                END,
                updated_at = now()
              WHERE product_id = ${item.productId}::uuid
                AND size = ${item.size}
                AND COALESCE(stock_quantity, 0) >= ${item.quantity}
              RETURNING id
            )
            SELECT 1 / (SELECT count(*)::int FROM updated) AS ok
          `,
          txn`
            INSERT INTO inventory_movements (
              product_id,
              variant_id,
              order_id,
              product_name,
              size,
              movement_type,
              quantity,
              unit_cost,
              unit_price,
              note,
              created_at
            ) VALUES (
              ${item.productId}::uuid,
              (SELECT id FROM product_variants WHERE product_id = ${item.productId}::uuid AND size = ${item.size} LIMIT 1),
              ${orderId}::uuid,
              ${item.productName},
              ${item.size},
              'sale',
              ${item.quantity},
              ${item.unitCost},
              ${item.unitPrice},
              'Venta por pedido online',
              now()
            )
          `,
        ];
      }),
      txn`
        UPDATE orders
        SET
          payment_status = 'paid',
          payment_provider = COALESCE(${provider || null}, payment_provider),
          payment_reference = COALESCE(${transactionId || null}, payment_reference),
          order_status = CASE WHEN order_status = 'received' THEN 'confirmed' ELSE order_status END,
          updated_at = now()
        WHERE id = ${orderId}::uuid
      `,
    ], { isolationMode: "Serializable" });
    return;
  }

  if (paymentStatus === "refunded" && order.paymentStatus === "paid") {
    await sql.transaction((txn) => [
      ...items.flatMap((item) => {
        if (!item.productId) return [];
        return [
          txn`
            UPDATE product_variants
            SET
              stock_quantity = COALESCE(stock_quantity, 0) + ${item.quantity},
              stock_status = 'available',
              updated_at = now()
            WHERE product_id = ${item.productId}::uuid AND size = ${item.size}
          `,
          txn`
            INSERT INTO inventory_movements (
              product_id,
              variant_id,
              order_id,
              product_name,
              size,
              movement_type,
              quantity,
              unit_cost,
              unit_price,
              note,
              created_at
            ) VALUES (
              ${item.productId}::uuid,
              (SELECT id FROM product_variants WHERE product_id = ${item.productId}::uuid AND size = ${item.size} LIMIT 1),
              ${orderId}::uuid,
              ${item.productName},
              ${item.size},
              'return',
              ${item.quantity},
              ${item.unitCost},
              ${item.unitPrice},
              'Reintegro de inventario por devolución',
              now()
            )
          `,
        ];
      }),
      txn`
        UPDATE orders
        SET
          payment_status = 'refunded',
          payment_provider = COALESCE(${provider || null}, payment_provider),
          payment_reference = COALESCE(${transactionId || null}, payment_reference),
          order_status = 'cancelled',
          updated_at = now()
        WHERE id = ${orderId}::uuid
      `,
    ], { isolationMode: "Serializable" });
    return;
  }

  await db.update(orders).set({
    paymentStatus,
    paymentProvider: provider || order.paymentProvider,
    paymentReference: transactionId || order.paymentReference,
    updatedAt: new Date(),
  }).where(eq(orders.id, orderId));
}

export async function findOrderByPaymentReference(reference: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.paymentReference, reference)))
    .limit(1);
  return order || null;
}
