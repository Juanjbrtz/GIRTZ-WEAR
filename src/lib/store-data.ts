import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  customers,
  inventoryMovements,
  orders,
  products,
  productVariants,
} from "@/db/schema";

export type AuthUserShape = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "admin" | "customer";
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureCustomerForUser(user: AuthUserShape) {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  const roleUpdate = user.role ? { role: user.role } : {};
  const [byAuthId] = await db.select().from(customers).where(eq(customers.authUserId, user.id)).limit(1);

  if (byAuthId) {
    const [updated] = await db.update(customers).set({
      name: user.name || byAuthId.name,
      email: user.email || byAuthId.email,
      ...roleUpdate,
      updatedAt: new Date(),
    }).where(eq(customers.id, byAuthId.id)).returning();
    return updated;
  }

  if (user.email) {
    const [byEmail] = await db.select().from(customers).where(eq(customers.email, user.email)).limit(1);
    if (byEmail) {
      const [linked] = await db.update(customers).set({
        authUserId: user.id,
        name: user.name || byEmail.name,
        ...roleUpdate,
        updatedAt: new Date(),
      }).where(eq(customers.id, byEmail.id)).returning();
      return linked;
    }
  }

  const [created] = await db.insert(customers).values({
    authUserId: user.id,
    name: user.name || user.email || "Cliente GIRTZ",
    email: user.email || null,
    role: user.role || "customer",
  }).returning();
  return created;
}

export async function getOrdersForCustomer(customerId: string) {
  if (!isDatabaseConfigured()) return [];
  return getDb().select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
}

export async function getAdminStats() {
  if (!isDatabaseConfigured()) {
    return {
      customers: 0,
      orders: 0,
      products: 0,
      revenue: 0,
      grossProfit: 0,
      unitsSold: 0,
      inventoryUnits: 0,
      inventoryValue: 0,
    };
  }

  const db = getDb();
  const [[customerCount], [orderCount], [productCount], [sales], [inventory]] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(customers),
    db.select({ value: sql<number>`count(*)::int` }).from(orders),
    db.select({ value: sql<number>`count(*)::int` }).from(products).where(sql`${products.category} IS DISTINCT FROM '__asset'`),
    db.select({
      revenue: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        else 0 end), 0)::int`,
      cost: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        else 0 end), 0)::int`,
      units: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity}
        else 0 end), 0)::int`,
    }).from(inventoryMovements),
    db.select({
      units: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)::int`,
      value: sql<number>`coalesce(sum(coalesce(${productVariants.stockQuantity},0) * ${products.cost}), 0)::int`,
    }).from(productVariants).leftJoin(products, eq(productVariants.productId, products.id)),
  ]);

  const revenue = sales?.revenue || 0;
  const cost = sales?.cost || 0;
  return {
    customers: customerCount?.value || 0,
    orders: orderCount?.value || 0,
    products: productCount?.value || 0,
    revenue,
    grossProfit: revenue - cost,
    unitsSold: sales?.units || 0,
    inventoryUnits: inventory?.units || 0,
    inventoryValue: inventory?.value || 0,
  };
}

export async function getAdminCustomers() {
  if (!isDatabaseConfigured()) return [];
  return getDb().select().from(customers).orderBy(desc(customers.createdAt));
}

export async function getAdminOrders() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();
  return db.select({
    id: orders.id,
    customerId: orders.customerId,
    customerName: sql<string | null>`coalesce(${orders.customerName}, ${customers.name})`,
    customerEmail: sql<string | null>`coalesce(${orders.customerEmail}, ${customers.email})`,
    customerPhone: orders.customerPhone,
    shippingAddress: orders.shippingAddress,
    shippingCity: orders.shippingCity,
    shippingDepartment: orders.shippingDepartment,
    total: orders.total,
    totalCost: orders.totalCost,
    shippingCost: orders.shippingCost,
    paymentStatus: orders.paymentStatus,
    paymentProvider: orders.paymentProvider,
    paymentReference: orders.paymentReference,
    paymentTransactionId: orders.paymentTransactionId,
    orderStatus: orders.orderStatus,
    shippingStatus: orders.shippingStatus,
    trackingNumber: orders.trackingNumber,
    supplierReference: orders.supplierReference,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
  }).from(orders).leftJoin(customers, eq(orders.customerId, customers.id)).orderBy(desc(orders.createdAt));
}

export async function getAdminProducts() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();
  const rows = await db.select().from(products)
    .where(sql`${products.category} IS DISTINCT FROM '__asset'`)
    .orderBy(desc(products.featured), desc(products.updatedAt));
  if (!rows.length) return [];

  const variants = await db.select().from(productVariants).orderBy(productVariants.size);
  return rows.map((product) => ({
    ...product,
    stockQuantity: variants
      .filter((variant) => variant.productId === product.id)
      .reduce((sum, variant) => sum + Math.max(0, variant.stockQuantity || 0), 0),
    variants: variants.filter((variant) => variant.productId === product.id),
  }));
}

export async function getInventoryDashboard() {
  if (!isDatabaseConfigured()) return { products: [], movements: [] };
  const db = getDb();
  const [catalog, variants, movements] = await Promise.all([
    db.select().from(products).where(sql`${products.category} IS DISTINCT FROM '__asset'`).orderBy(desc(products.updatedAt)),
    db.select().from(productVariants).orderBy(productVariants.size),
    db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.createdAt)).limit(100),
  ]);

  return {
    products: catalog.map((product) => ({
      ...product,
      variants: variants.filter((variant) => variant.productId === product.id),
      stockQuantity: variants
        .filter((variant) => variant.productId === product.id)
        .reduce((sum, variant) => sum + Math.max(0, variant.stockQuantity || 0), 0),
    })),
    movements,
  };
}

export async function getSalesDashboard() {
  if (!isDatabaseConfigured()) {
    return { revenue: 0, cost: 0, profit: 0, units: 0, products: [], movements: [] };
  }

  const db = getDb();
  const saleWhere = sql`${inventoryMovements.movementType} in ('sale','sale_manual','return')`;
  const [[summary], productRows, movements] = await Promise.all([
    db.select({
      revenue: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        else 0 end), 0)::int`,
      cost: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        else 0 end), 0)::int`,
      units: sql<number>`coalesce(sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity}
        else 0 end), 0)::int`,
    }).from(inventoryMovements).where(saleWhere),
    db.select({
      productId: inventoryMovements.productId,
      productName: sql<string>`coalesce(${products.name}, ${inventoryMovements.productName})`,
      units: sql<number>`sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity}
        else 0 end)::int`,
      revenue: sql<number>`sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice}
        else 0 end)::int`,
      cost: sql<number>`sum(case
        when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost}
        else 0 end)::int`,
    })
      .from(inventoryMovements)
      .leftJoin(products, eq(inventoryMovements.productId, products.id))
      .where(saleWhere)
      .groupBy(inventoryMovements.productId, products.name, inventoryMovements.productName)
      .orderBy(sql`sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} else 0 end) desc`),
    db.select().from(inventoryMovements).where(saleWhere).orderBy(desc(inventoryMovements.createdAt)).limit(100),
  ]);

  const revenue = summary?.revenue || 0;
  const cost = summary?.cost || 0;
  return {
    revenue,
    cost,
    profit: revenue - cost,
    units: summary?.units || 0,
    products: productRows.map((row) => ({ ...row, profit: (row.revenue || 0) - (row.cost || 0) })),
    movements,
  };
}
