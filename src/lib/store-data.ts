import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  customers,
  orders,
  products,
  productVariants,
} from "@/db/schema";

export type AuthUserShape = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureCustomerForUser(user: AuthUserShape) {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  const [byAuthId] = await db
    .select()
    .from(customers)
    .where(eq(customers.authUserId, user.id))
    .limit(1);

  if (byAuthId) {
    const [updated] = await db
      .update(customers)
      .set({
        name: user.name || byAuthId.name,
        email: user.email || byAuthId.email,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, byAuthId.id))
      .returning();

    return updated;
  }

  if (user.email) {
    const [byEmail] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, user.email))
      .limit(1);

    if (byEmail) {
      const [linked] = await db
        .update(customers)
        .set({
          authUserId: user.id,
          name: user.name || byEmail.name,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, byEmail.id))
        .returning();

      return linked;
    }
  }

  const [created] = await db
    .insert(customers)
    .values({
      authUserId: user.id,
      name: user.name || user.email || "Cliente GIRTZ",
      email: user.email || null,
    })
    .returning();

  return created;
}

export async function getOrdersForCustomer(customerId: string) {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();

  return db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getAdminStats() {
  if (!isDatabaseConfigured()) {
    return { customers: 0, orders: 0, products: 0, revenue: 0, grossProfit: 0 };
  }

  const db = getDb();
  const [[customerCount], [orderCount], [productCount], [totals]] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(customers),
    db.select({ value: sql<number>`count(*)::int` }).from(orders),
    db.select({ value: sql<number>`count(*)::int` }).from(products),
    db
      .select({
        revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
        cost: sql<number>`coalesce(sum(${orders.totalCost}), 0)::int`,
      })
      .from(orders),
  ]);

  const revenue = totals?.revenue || 0;
  const cost = totals?.cost || 0;

  return {
    customers: customerCount?.value || 0,
    orders: orderCount?.value || 0,
    products: productCount?.value || 0,
    revenue,
    grossProfit: revenue - cost,
  };
}

export async function getAdminCustomers() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();

  return db.select().from(customers).orderBy(desc(customers.createdAt));
}

export async function getAdminOrders() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();

  return db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      total: orders.total,
      totalCost: orders.totalCost,
      paymentStatus: orders.paymentStatus,
      orderStatus: orders.orderStatus,
      shippingStatus: orders.shippingStatus,
      trackingNumber: orders.trackingNumber,
      supplierReference: orders.supplierReference,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt));
}

export async function getAdminProducts() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();

  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  if (!rows.length) return [];

  const variants = await db
    .select()
    .from(productVariants)
    .orderBy(productVariants.size);

  return rows.map((product) => ({
    ...product,
    variants: variants.filter((variant) => variant.productId === product.id),
  }));
}
