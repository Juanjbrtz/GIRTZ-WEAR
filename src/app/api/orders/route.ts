import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb, getSqlClient } from "@/db";
import { customers, products, productVariants } from "@/db/schema";
import { getSessionAccount } from "@/lib/session";
import { buildWompiCheckoutUrl, isWompiConfigured } from "@/lib/wompi";

export const runtime = "nodejs";

type CheckoutItem = {
  slug?: string;
  variantId?: string;
  size?: string;
  quantity?: number;
};

type CheckoutPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  notes?: string;
  items?: CheckoutItem[];
};

function clean(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: CheckoutPayload;
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180).toLowerCase();
  const phone = clean(payload.phone, 40);
  const address = clean(payload.address, 220);
  const city = clean(payload.city, 100);
  const department = clean(payload.department, 100);
  const notes = clean(payload.notes, 500);
  const rawItems = Array.isArray(payload.items) ? payload.items.slice(0, 30) : [];

  if (!name || !email || !phone || !address || !city || !department) {
    return Response.json(
      { error: "Completa nombre, correo, teléfono y dirección de entrega." },
      { status: 400 },
    );
  }

  if (!rawItems.length) {
    return Response.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const db = getDb();
  const validated: Array<{
    productId: string;
    variantId: string;
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
  }> = [];

  for (const raw of rawItems) {
    const slug = clean(raw.slug, 240);
    const variantId = clean(raw.variantId, 80);
    const size = clean(raw.size, 30);
    const quantity = Math.min(10, Math.max(1, Math.floor(Number(raw.quantity) || 1)));

    if (!slug || !variantId || !size) {
      return Response.json({ error: "Hay un producto sin talla seleccionada." }, { status: 400 });
    }

    const [row] = await db
      .select({
        productId: products.id,
        productName: products.name,
        price: products.price,
        cost: products.cost,
        active: products.active,
        variantId: productVariants.id,
        variantSize: productVariants.size,
        stockQuantity: productVariants.stockQuantity,
      })
      .from(products)
      .innerJoin(productVariants, eq(productVariants.productId, products.id))
      .where(
        and(
          eq(products.slug, slug),
          eq(products.active, true),
          eq(productVariants.id, variantId),
          eq(productVariants.size, size),
        ),
      )
      .limit(1);

    if (!row) {
      return Response.json({ error: `La referencia ${slug} ya no está disponible.` }, { status: 400 });
    }

    if (Math.max(0, row.stockQuantity || 0) < quantity) {
      return Response.json(
        { error: `${row.productName}, talla ${size}, no tiene suficientes unidades disponibles.` },
        { status: 409 },
      );
    }

    validated.push({
      productId: row.productId,
      variantId: row.variantId,
      productName: row.productName,
      size,
      quantity,
      unitPrice: row.price,
      unitCost: Math.max(0, row.cost || 0),
    });
  }

  const subtotal = validated.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalCost = validated.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const account = await getSessionAccount();
  let customerId = account.customer?.id || null;

  if (!customerId) {
    const [existingCustomer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const [createdCustomer] = await db
        .insert(customers)
        .values({ name, email, phone, address, city, role: "customer" })
        .returning({ id: customers.id });
      customerId = createdCustomer?.id || null;
    }
  }

  if (customerId) {
    await db
      .update(customers)
      .set({ name, email, phone, address, city, updatedAt: new Date() })
      .where(eq(customers.id, customerId));
  }

  const orderId = randomUUID();
  const accessToken = randomUUID().replace(/-/g, "");
  const paymentReference = `GIRTZ-${Date.now().toString(36).toUpperCase()}-${orderId.slice(0, 8).toUpperCase()}`;
  const paymentProvider = isWompiConfigured() ? "wompi" : null;
  const sql = getSqlClient();

  await sql.transaction((txn) => [
    txn`
      INSERT INTO orders (
        id,
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_department,
        notes,
        access_token,
        total,
        total_cost,
        shipping_cost,
        payment_status,
        payment_provider,
        payment_reference,
        order_status,
        shipping_status,
        supplier_reference,
        created_at,
        updated_at
      ) VALUES (
        ${orderId}::uuid,
        ${customerId}::uuid,
        ${name},
        ${email},
        ${phone},
        ${address},
        ${city},
        ${department},
        ${notes || null},
        ${accessToken},
        ${total},
        ${totalCost},
        ${shippingCost},
        'pending',
        ${paymentProvider},
        ${paymentReference},
        'received',
        'pending',
        'WEB GIRTZ',
        now(),
        now()
      )
    `,
    ...validated.map((item) => txn`
      INSERT INTO order_items (
        order_id,
        product_id,
        product_name,
        size,
        quantity,
        unit_price,
        unit_cost
      ) VALUES (
        ${orderId}::uuid,
        ${item.productId}::uuid,
        ${item.productName},
        ${item.size},
        ${item.quantity},
        ${item.unitPrice},
        ${item.unitCost}
      )
    `),
  ]);

  const paymentUrl = buildWompiCheckoutUrl({
    orderId,
    accessToken,
    reference: paymentReference,
    totalCop: total,
    customerEmail: email,
    customerName: name,
    customerPhone: phone,
  });

  return Response.json({
    ok: true,
    orderId,
    accessToken,
    total,
    paymentConfigured: Boolean(paymentUrl),
    paymentUrl,
  });
}
