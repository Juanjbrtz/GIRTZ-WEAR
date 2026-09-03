import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { customers, orderItems, orders } from "@/db/schema";
import { approvedCatalogProducts } from "@/data/catalog-approved";
import { getSessionAccount } from "@/lib/session";

export const runtime = "nodejs";

type CheckoutItem = {
  slug?: string;
  quantity?: number;
  size?: string;
};

type CheckoutPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  items?: CheckoutItem[];
};

function clean(value: unknown, max = 180) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const account = await getSessionAccount();

  if (!account.configured || !account.session?.user || !account.customer) {
    return Response.json(
      { error: "Debes iniciar sesión para crear el pedido." },
      { status: 401 },
    );
  }

  let payload: CheckoutPayload;
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const rawItems = Array.isArray(payload.items) ? payload.items.slice(0, 30) : [];
  if (!rawItems.length) {
    return Response.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const validated = [] as Array<{
    product: (typeof approvedCatalogProducts)[number];
    quantity: number;
    size: string;
  }>;

  for (const raw of rawItems) {
    const slug = clean(raw.slug, 240);
    const product = approvedCatalogProducts.find((entry) => entry.slug === slug);
    if (!product) {
      return Response.json(
        { error: `Una referencia del carrito ya no está disponible: ${slug || "sin referencia"}.` },
        { status: 400 },
      );
    }

    const quantity = Math.min(10, Math.max(1, Number(raw.quantity) || 1));
    validated.push({
      product,
      quantity,
      size: clean(raw.size, 30) || "POR CONFIRMAR",
    });
  }

  const total = validated.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const name = clean(payload.name, 120) || account.customer.name;
  const email = clean(payload.email, 180) || account.customer.email || account.session.user.email || "";
  const phone = clean(payload.phone, 40);
  const address = clean(payload.address, 220);
  const city = clean(payload.city, 100);

  if (!name || !email || !phone || !address || !city) {
    return Response.json(
      { error: "Completa nombre, correo, teléfono, dirección y ciudad." },
      { status: 400 },
    );
  }

  const db = getDb();

  await db
    .update(customers)
    .set({
      name,
      email,
      phone,
      address,
      city,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, account.customer.id));

  const [order] = await db
    .insert(orders)
    .values({
      customerId: account.customer.id,
      total,
      totalCost: 0,
      paymentStatus: "pending",
      orderStatus: "received",
      shippingStatus: "pending",
      supplierReference: "WEB GIRTZ",
    })
    .returning();

  await db.insert(orderItems).values(
    validated.map(({ product, quantity, size }) => ({
      orderId: order.id,
      productId: null,
      productName: product.name,
      size,
      quantity,
      unitPrice: product.price,
      unitCost: 0,
    })),
  );

  return Response.json({
    ok: true,
    orderId: order.id,
    total,
  });
}
