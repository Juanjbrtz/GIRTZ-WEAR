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
      customers: 0, orders: 0, products: 0, revenue: 0, cost: 0, grossProfit: 0,
      expenses: 0, netProfit: 0, unitsSold: 0, inventoryUnits: 0, inventoryValue: 0,
    };
  }

  const db = getDb();
  const [[customerCount], [orderCount], [productCount], [sales], [expenseSummary], [inventory]] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(customers),
    db.select({ value: sql<number>`count(*)::int` }).from(orders),
    db.select({ value: sql<number>`count(*)::int` }).from(products).where(sql`${products.category} IS DISTINCT FROM '__asset'`),
    db.select({
      revenue: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} else 0 end),0)::int`,
      cost: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost} when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost} else 0 end),0)::int`,
      units: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} when ${inventoryMovements.movementType} = 'return' then -${inventoryMovements.quantity} else 0 end),0)::int`,
    }).from(inventoryMovements),
    db.select({ value: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} = 'expense' then abs(${inventoryMovements.quantity}) * ${inventoryMovements.unitCost} else 0 end),0)::int` }).from(inventoryMovements),
    db.select({
      units: sql<number>`coalesce(sum(${productVariants.stockQuantity}),0)::int`,
      value: sql<number>`coalesce(sum(coalesce(${productVariants.stockQuantity},0) * coalesce(${products.cost},0)),0)::int`,
    }).from(productVariants).leftJoin(products, eq(productVariants.productId, products.id)),
  ]);

  const revenue = sales?.revenue || 0;
  const cost = sales?.cost || 0;
  const expenses = expenseSummary?.value || 0;
  const grossProfit = revenue - cost;

  return {
    customers: customerCount?.value || 0,
    orders: orderCount?.value || 0,
    products: productCount?.value || 0,
    revenue,
    cost,
    grossProfit,
    expenses,
    netProfit: grossProfit - expenses,
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
  return rows.map((product) => {
    const productVariantsRows = variants.filter((variant) => variant.productId === product.id);
    return {
      ...product,
      stockQuantity: productVariantsRows.reduce((sum, variant) => sum + Math.max(0, variant.stockQuantity || 0), 0),
      variants: productVariantsRows,
    };
  });
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
    products: catalog.map((product) => {
      const productVariantRows = variants.filter((variant) => variant.productId === product.id);
      const stockQuantity = productVariantRows.reduce((sum, variant) => sum + Math.max(0, variant.stockQuantity || 0), 0);
      return {
        ...product,
        variants: productVariantRows,
        stockQuantity,
        inventoryValue: stockQuantity * Math.max(0, product.cost || 0),
        projectedGrossProfitPerUnit: Math.max(0, product.price - Math.max(0, product.cost || 0)),
      };
    }),
    movements,
  };
}

export async function getSalesDashboard() {
  if (!isDatabaseConfigured()) {
    return { revenue: 0, cost: 0, grossProfit: 0, expenses: 0, netProfit: 0, units: 0, products: [], movements: [], expenseMovements: [] };
  }

  const db = getDb();
  const saleWhere = sql`${inventoryMovements.movementType} in ('sale','sale_manual','return')`;
  const expenseWhere = sql`${inventoryMovements.movementType} = 'expense'`;
  const [[summary], [expenseSummary], productSales, productExpenses, movements, expenseMovements] = await Promise.all([
    db.select({
      revenue: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} else 0 end),0)::int`,
      cost: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost} else 0 end),0)::int`,
      units: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} else 0 end),0)::int`,
    }).from(inventoryMovements).where(saleWhere),
    db.select({ value: sql<number>`coalesce(sum(abs(${inventoryMovements.quantity}) * ${inventoryMovements.unitCost}),0)::int` }).from(inventoryMovements).where(expenseWhere),
    db.select({
      productId: inventoryMovements.productId,
      productName: sql<string>`coalesce(${products.name}, ${inventoryMovements.productName})`,
      units: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} else 0 end),0)::int`,
      revenue: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitPrice} else 0 end),0)::int`,
      cost: sql<number>`coalesce(sum(case when ${inventoryMovements.movementType} in ('sale','sale_manual') then ${inventoryMovements.quantity} * ${inventoryMovements.unitCost} when ${inventoryMovements.movementType}='return' then -${inventoryMovements.quantity} * ${inventoryMovements.unitCost} else 0 end),0)::int`,
    }).from(inventoryMovements).leftJoin(products, eq(inventoryMovements.productId, products.id)).where(saleWhere).groupBy(inventoryMovements.productId, products.name, inventoryMovements.productName),
    db.select({
      productId: inventoryMovements.productId,
      productName: sql<string>`coalesce(${products.name}, ${inventoryMovements.productName})`,
      amount: sql<number>`coalesce(sum(abs(${inventoryMovements.quantity}) * ${inventoryMovements.unitCost}),0)::int`,
    }).from(inventoryMovements).leftJoin(products, eq(inventoryMovements.productId, products.id)).where(expenseWhere).groupBy(inventoryMovements.productId, products.name, inventoryMovements.productName),
    db.select().from(inventoryMovements).where(saleWhere).orderBy(desc(inventoryMovements.createdAt)).limit(100),
    db.select().from(inventoryMovements).where(expenseWhere).orderBy(desc(inventoryMovements.createdAt)).limit(100),
  ]);

  const productMap = new Map<string, { productId: string | null; productName: string; units: number; revenue: number; cost: number; expenses: number }>();
  for (const row of productSales) {
    const key = row.productId || `deleted:${row.productName}`;
    productMap.set(key, { productId: row.productId, productName: row.productName, units: row.units || 0, revenue: row.revenue || 0, cost: row.cost || 0, expenses: 0 });
  }
  for (const row of productExpenses) {
    const key = row.productId || `deleted:${row.productName}`;
    const current = productMap.get(key) || { productId: row.productId, productName: row.productName, units: 0, revenue: 0, cost: 0, expenses: 0 };
    current.expenses += row.amount || 0;
    productMap.set(key, current);
  }

  const revenue = summary?.revenue || 0;
  const cost = summary?.cost || 0;
  const expenses = expenseSummary?.value || 0;
  const grossProfit = revenue - cost;

  return {
    revenue, cost, grossProfit, expenses, netProfit: grossProfit - expenses, units: summary?.units || 0,
    products: Array.from(productMap.values()).map((row) => ({ ...row, grossProfit: row.revenue - row.cost, netProfit: row.revenue - row.cost - row.expenses })),
    movements,
    expenseMovements,
  };
}

export async function getSupplierDashboard() {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();
  return db.select({
    supplier: inventoryMovements.supplier,
    entries: sql<number>`count(*)::int`,
    units: sql<number>`coalesce(sum(${inventoryMovements.quantity}),0)::int`,
    purchaseValue: sql<number>`coalesce(sum(${inventoryMovements.quantity} * ${inventoryMovements.unitCost}),0)::int`,
    products: sql<number>`count(distinct ${inventoryMovements.productId})::int`,
    lastPurchase: sql<Date>`max(${inventoryMovements.createdAt})`,
  }).from(inventoryMovements)
    .where(sql`${inventoryMovements.movementType} = 'purchase' and ${inventoryMovements.supplier} is not null and trim(${inventoryMovements.supplier}) <> ''`)
    .groupBy(inventoryMovements.supplier)
    .orderBy(sql`max(${inventoryMovements.createdAt}) desc`);
}
