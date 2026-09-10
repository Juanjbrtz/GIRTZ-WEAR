"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { orders, products } from "@/db/schema";
import { setOrderPaymentState, type PaymentState } from "@/lib/order-lifecycle";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function getImageFile(formData: FormData, field: string, required: boolean) {
  const value = formData.get(field);
  if (!value || typeof value === "string" || value.size === 0) {
    if (required) throw new Error("Debes seleccionar una imagen para el producto.");
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) throw new Error("La imagen debe ser JPG, PNG, WebP o AVIF.");
  if (value.size > MAX_IMAGE_BYTES) throw new Error("La imagen supera el límite de 7 MB.");
  return value;
}

async function saveProductImage(productId: string, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const encoded = bytes.toString("base64");
  const sql = getSqlClient();
  await sql`
    INSERT INTO product_images (product_id, filename, content_type, image_data, updated_at)
    VALUES (${productId}::uuid, ${file.name || "producto"}, ${file.type || "image/jpeg"}, decode(${encoded}, 'base64'), now())
    ON CONFLICT (product_id)
    DO UPDATE SET filename = EXCLUDED.filename, content_type = EXCLUDED.content_type, image_data = EXCLUDED.image_data, updated_at = now()
  `;
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/sales");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = Math.round(Number(formData.get("price")) || 0);
  const cost = Math.max(0, Math.round(Number(formData.get("cost")) || 0));
  const image = getImageFile(formData, "image", true);
  const featured = formData.get("featured") === "on";

  if (!name || !price || !image) throw new Error("Completa foto, nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const baseSlug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, baseSlug)).limit(1);
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });

  const [created] = await db.insert(products).values({
    name,
    slug,
    brand,
    audience,
    description,
    price,
    cost,
    category: "Sneakers",
    imageUrl: null,
    featured,
    active: true,
  }).returning({ id: products.id });

  if (!created) throw new Error("No fue posible crear el producto.");
  await saveProductImage(created.id, image);
  await db.update(products).set({ imageUrl: `/api/product-image/${created.id}`, updatedAt: new Date() }).where(eq(products.id, created.id));

  revalidateStorefront(slug);
  redirect("/admin/products?created=1");
}

export async function registerInventoryPurchase(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const size = cleanText(formData.get("size"), 30);
  const quantity = Math.max(0, Math.floor(Number(formData.get("quantity")) || 0));
  const unitCost = Math.max(0, Math.round(Number(formData.get("unitCost")) || 0));
  const supplier = cleanText(formData.get("supplier"), 120);
  const note = cleanText(formData.get("note"), 300);

  if (!productId || !size || quantity < 1) throw new Error("Selecciona producto, talla y cantidad.");

  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new Error("Producto no encontrado.");

  const sql = getSqlClient();
  const stockRows = await sql`
    SELECT COALESCE(SUM(stock_quantity), 0)::int AS units
    FROM product_variants
    WHERE product_id = ${productId}::uuid
  `;
  const currentUnits = Number(stockRows[0]?.units || 0);
  const weightedCost = unitCost > 0
    ? Math.round(((Math.max(0, product.cost || 0) * currentUnits) + (unitCost * quantity)) / Math.max(1, currentUnits + quantity))
    : Math.max(0, product.cost || 0);

  await sql.transaction((txn) => [
    txn`
      INSERT INTO product_variants (product_id, size, stock_status, stock_quantity, created_at, updated_at)
      VALUES (${productId}::uuid, ${size}, 'available', ${quantity}, now(), now())
      ON CONFLICT (product_id, size)
      DO UPDATE SET
        stock_quantity = COALESCE(product_variants.stock_quantity, 0) + EXCLUDED.stock_quantity,
        stock_status = 'available',
        updated_at = now()
    `,
    txn`
      UPDATE products
      SET cost = ${weightedCost}, updated_at = now()
      WHERE id = ${productId}::uuid
    `,
    txn`
      INSERT INTO inventory_movements (
        product_id, variant_id, product_name, size, movement_type, quantity, unit_cost, unit_price, supplier, note, created_at
      ) VALUES (
        ${productId}::uuid,
        (SELECT id FROM product_variants WHERE product_id = ${productId}::uuid AND size = ${size} LIMIT 1),
        ${product.name}, ${size}, 'purchase', ${quantity}, ${unitCost}, ${product.price}, ${supplier || null}, ${note || null}, now()
      )
    `,
  ]);

  revalidateStorefront(product.slug);
  redirect(`/admin/inventory?added=1&product=${productId}`);
}

export async function registerManualSale(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const size = cleanText(formData.get("size"), 30);
  const quantity = Math.max(0, Math.floor(Number(formData.get("quantity")) || 0));
  const requestedPrice = Math.max(0, Math.round(Number(formData.get("unitPrice")) || 0));
  const note = cleanText(formData.get("note"), 300);

  if (!productId || !size || quantity < 1) throw new Error("Selecciona producto, talla y cantidad.");

  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new Error("Producto no encontrado.");
  const unitPrice = requestedPrice || product.price;
  const unitCost = Math.max(0, product.cost || 0);
  const sql = getSqlClient();

  await sql.transaction((txn) => [
    txn`
      WITH updated AS (
        UPDATE product_variants
        SET
          stock_quantity = COALESCE(stock_quantity, 0) - ${quantity},
          stock_status = CASE WHEN COALESCE(stock_quantity, 0) - ${quantity} > 0 THEN 'available' ELSE 'out_of_stock' END,
          updated_at = now()
        WHERE product_id = ${productId}::uuid
          AND size = ${size}
          AND COALESCE(stock_quantity, 0) >= ${quantity}
        RETURNING id
      )
      SELECT 1 / (SELECT count(*)::int FROM updated) AS ok
    `,
    txn`
      INSERT INTO inventory_movements (
        product_id, variant_id, product_name, size, movement_type, quantity, unit_cost, unit_price, note, created_at
      ) VALUES (
        ${productId}::uuid,
        (SELECT id FROM product_variants WHERE product_id = ${productId}::uuid AND size = ${size} LIMIT 1),
        ${product.name}, ${size}, 'sale_manual', ${quantity}, ${unitCost}, ${unitPrice}, ${note || 'Venta registrada manualmente'}, now()
      )
    `,
  ]);

  revalidateStorefront(product.slug);
  redirect(`/admin/sales?created=1&product=${productId}`);
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = Math.round(Number(formData.get("price")) || 0);
  const cost = Math.max(0, Math.round(Number(formData.get("cost")) || 0));
  const image = getImageFile(formData, "image", false);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!productId || !name || !price) throw new Error("Completa nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const [current] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, productId)).limit(1);
  if (!current) throw new Error("Producto no encontrado.");
  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });

  await db.update(products).set({
    name,
    brand,
    audience,
    description,
    price,
    cost,
    imageUrl: `/api/product-image/${productId}`,
    featured,
    active,
    updatedAt: new Date(),
  }).where(eq(products.id, productId));

  if (image) await saveProductImage(productId, image);
  revalidateStorefront(current.slug);
  redirect(`/admin/products/${productId}/edit?saved=1`);
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const orderId = cleanText(formData.get("orderId"), 80);
  const paymentStatus = cleanText(formData.get("paymentStatus"), 30) as PaymentState;
  const orderStatus = cleanText(formData.get("orderStatus"), 30);
  const shippingStatus = cleanText(formData.get("shippingStatus"), 30);
  const trackingNumber = cleanText(formData.get("trackingNumber"), 120) || null;

  const allowedPayment: PaymentState[] = ["pending", "paid", "failed", "refunded"];
  const allowedOrder = ["received", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const allowedShipping = ["pending", "preparing", "shipped", "delivered", "returned"];

  if (!orderId || !allowedPayment.includes(paymentStatus) || !allowedOrder.includes(orderStatus) || !allowedShipping.includes(shippingStatus)) {
    throw new Error("Estado de pedido inválido.");
  }

  await setOrderPaymentState({ orderId, paymentStatus });

  const db = getDb();
  await db.update(orders).set({ orderStatus, shippingStatus, trackingNumber, updatedAt: new Date() }).where(eq(orders.id, orderId));

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/sales");
  revalidatePath("/account");
  revalidatePath(`/order/${orderId}`);
  revalidatePath("/shop");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const productId = cleanText(formData.get("productId"), 80);
  const active = cleanText(formData.get("active"), 10) === "true";
  if (!productId) return;
  const db = getDb();
  await db.update(products).set({ active, updatedAt: new Date() }).where(eq(products.id, productId));
  revalidateStorefront();
}
