import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    brand: text("brand"),
    audience: text("audience"),
    sku: text("sku"),
    description: text("description"),
    price: integer("price").notNull(),
    cost: integer("cost").notNull(),
    category: text("category"),
    imageUrl: text("image_url"),
    featured: boolean("featured").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    uniqueIndex("products_sku_idx").on(table.sku),
    index("products_active_featured_idx").on(table.active, table.featured),
    index("products_brand_idx").on(table.brand),
    index("products_audience_idx").on(table.audience),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    sku: text("sku"),
    stockStatus: text("stock_status").default("available").notNull(),
    stockQuantity: integer("stock_quantity"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("product_variant_product_size_idx").on(table.productId, table.size),
    uniqueIndex("product_variants_sku_idx").on(table.sku),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authUserId: text("auth_user_id"),
    role: text("role").default("customer").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    city: text("city"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("customers_auth_user_id_idx").on(table.authUserId),
    index("customers_role_idx").on(table.role),
    index("customers_email_idx").on(table.email),
    index("customers_phone_idx").on(table.phone),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    total: integer("total").notNull(),
    totalCost: integer("total_cost").notNull(),
    paymentStatus: text("payment_status").default("pending").notNull(),
    orderStatus: text("order_status").default("received").notNull(),
    shippingStatus: text("shipping_status").default("pending").notNull(),
    trackingNumber: text("tracking_number"),
    supplierReference: text("supplier_reference"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_customer_idx").on(table.customerId),
    index("orders_created_at_idx").on(table.createdAt),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    size: text("size").notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: integer("unit_price").notNull(),
    unitCost: integer("unit_cost").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);
