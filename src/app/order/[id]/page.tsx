import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatCop } from "@/data/products";
import { requireAccount } from "@/lib/session";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  received: "Recibido",
  confirmed: "Confirmado",
  preparing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  paid: "Pagado",
  cancelled: "Cancelado",
};

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await requireAccount();
  if (!account.customer) notFound();

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.customerId, account.customer.id)))
    .limit(1);

  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return (
    <main className="inner-page order-page">
      <SiteHeader />

      <section className="order-shell">
        <div className="order-confirmation-head">
          <span className="eyebrow">PEDIDO RECIBIDO</span>
          <h1>GRACIAS.</h1>
          <p>
            Tu pedido ya quedó registrado. Confirmaremos disponibilidad de talla, valor del envío y forma de pago antes del despacho.
          </p>
        </div>

        <div className="order-layout">
          <div className="order-detail-card">
            <div className="order-number-row">
              <span>NÚMERO DE PEDIDO</span>
              <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
            </div>

            <div className="order-status-grid">
              <div>
                <span>PAGO</span>
                <strong>{statusLabel[order.paymentStatus] || order.paymentStatus}</strong>
              </div>
              <div>
                <span>PEDIDO</span>
                <strong>{statusLabel[order.orderStatus] || order.orderStatus}</strong>
              </div>
              <div>
                <span>ENVÍO</span>
                <strong>{statusLabel[order.shippingStatus] || order.shippingStatus}</strong>
              </div>
            </div>

            <div className="order-products">
              {items.map((item) => (
                <div key={item.id} className="order-product-row">
                  <div>
                    <strong>{item.productName}</strong>
                    <small>
                      Talla {item.size} · Cantidad {item.quantity}
                    </small>
                  </div>
                  <span>{formatCop(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-total-row">
              <span>TOTAL PRODUCTOS</span>
              <strong>{formatCop(order.total)}</strong>
            </div>
            <small className="order-shipping-note">Envío pendiente de confirmar.</small>
          </div>

          <aside className="order-next-steps">
            <span className="eyebrow">¿QUÉ SIGUE?</span>
            <ol>
              <li>Confirmamos la talla solicitada.</li>
              <li>Te indicamos disponibilidad y valor del envío.</li>
              <li>Confirmamos el pago.</li>
              <li>Despachamos y agregamos la guía al pedido.</li>
            </ol>
            <Link href="/account" className="primary-button">VER MIS PEDIDOS</Link>
            <Link href="/shop" className="secondary-button">VOLVER AL CATÁLOGO</Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
