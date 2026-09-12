"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const EXPENSE_CATEGORIES = new Set(["Transporte proveedor", "Empaque", "Envío cliente", "Comisión", "Publicidad", "Otro"]);

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function money(value: FormDataEntryValue | null) {
  return Math.max(0, Math.round(Number(String(value || "").replace(/\D/g, "")) || 0));
}

function getImageFile(formData: FormData, field: string, required: boolean) {
  const value = formData.get(field);
  if (!value || typeof value === "string" || value.size === 0) {
    if (required) throw new Error("Debes seleccionar una foto para el producto.");
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) throw new Error("La foto debe ser JPG, PNG, WebP o AVIF.");
  if (value.size > MAX_IMAGE_BYTES) throw new Error("La foto supera el límite de 7 MB.");
  return value;
}

async function saveProductImage(productId: string, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const encoded = bytes.toString("base64");
  const sqlClient = getSqlClient();
  await sqlClient`
    INSERT INTO product_images (product_id, filename, content_type, image_data, updated_at)
    VALUES (${productId}::uuid, ${file.name || "producto"}, ${file.type || "image/jpeg"}, decode(${encoded}, 'base64'), now())
    ON CONFLICT (product_id)
    DO UPDATE SET filename=EXCLUDED.filename, content_type=EXCLUDED.content_type, image_data=EXCLUDED.image_data, updated_at=now()
  `;
}

function revalidateAdminAndStore(slug?: string) {
  for (const path of ["/", "/shop", "/cart", "/admin", "/admin/products", "/admin/inventory", "/admin/sales", "/admin/providers"]) revalidatePath(path);
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = money(formData.get("price"));
  const cost = money(formData.get("cost"));
  const image = getImageFile(formData, "image", true);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!name || price < 100 || !image) throw new Error("Completa foto, nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const slug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  if (existing) redirect(`/admin/products?duplicate=1`);

  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });
  const [created] = await db.insert(products).values({
    name, slug, brand, audience, sku: null,
    description: description || "Referencia disponible por pedido. Confirma disponibilidad antes de cerrar la compra por WhatsApp.",
    price, cost, category: "Sneakers", imageUrl: null, featured, active,
  }).returning({ id: products.id });

  if (!created) throw new Error("No fue posible crear el producto.");
  await saveProductImage(created.id, image);
  await db.update(products).set({ imageUrl: `/api/product-image/${created.id}`, updatedAt: new Date() }).where(eq(products.id, created.id));
  revalidateAdminAndStore(slug);
  redirect("/admin/products?created=1");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = money(formData.get("price"));
  const cost = money(formData.get("cost"));
  const image = getImageFile(formData, "image", false);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!productId || !name || price < 100) throw new Error("Completa nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const [current] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, productId)).limit(1);
  if (!current) throw new Error("Producto no encontrado.");
  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });

  await db.update(products).set({
    name, brand, audience,
    description: description || "Referencia disponible por pedido. Confirma disponibilidad antes de cerrar la compra por WhatsApp.",
    price, cost, imageUrl: `/api/product-image/${productId}`, featured, active, updatedAt: new Date(),
  }).where(eq(products.id, productId));
  if (image) await saveProductImage(productId, image);

  revalidateAdminAndStore(current.slug);
  redirect(`/admin/products/${productId}/edit?saved=1`);
}

export async function registerInventoryPurchase(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const size = cleanText(formData.get("size"), 30);
  const quantity = Math.max(1, Math.floor(Number(formData.get("quantity")) || 1));
  const unitCost = money(formData.get("unitCost"));
  const purchaseExpense = money(formData.get("purchaseExpense"));
  const supplier = cleanText(formData.get("supplier"), 120);
  const note = cleanText(formData.get("note"), 300);
  if (!productId || !size) throw new Error("Selecciona producto y talla.");

  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new Error("Producto no encontrado.");
  const client = getSqlClient();
  const currentRows = await client`SELECT COALESCE(SUM(stock_quantity),0)::int AS units FROM product_variants WHERE product_id=${productId}::uuid`;
  const currentUnits = Number(currentRows[0]?.units || 0);
  const weightedCost = unitCost > 0 ? Math.round(((Math.max(0, product.cost) * currentUnits) + (unitCost * quantity)) / Math.max(1, currentUnits + quantity)) : product.cost;

  await client.transaction((txn) => [
    txn`INSERT INTO product_variants (product_id,size,stock_status,stock_quantity,created_at,updated_at)
        VALUES (${productId}::uuid,${size},'available',${quantity},now(),now())
        ON CONFLICT (product_id,size) DO UPDATE SET stock_quantity=COALESCE(product_variants.stock_quantity,0)+EXCLUDED.stock_quantity, stock_status='available', updated_at=now()`,
    txn`UPDATE products SET cost=${weightedCost}, updated_at=now() WHERE id=${productId}::uuid`,
    txn`INSERT INTO inventory_movements (product_id,variant_id,product_name,size,movement_type,quantity,unit_cost,unit_price,supplier,note,created_at)
        VALUES (${productId}::uuid,(SELECT id FROM product_variants WHERE product_id=${productId}::uuid AND size=${size} LIMIT 1),${product.name},${size},'purchase',${quantity},${unitCost},${product.price},${supplier || null},${note || null},now())`,
  ]);

  if (purchaseExpense > 0) {
    await client`INSERT INTO inventory_movements (product_id,product_name,size,movement_type,quantity,unit_cost,unit_price,supplier,note,created_at)
      VALUES (${productId}::uuid,${product.name},${size},'expense',1,${purchaseExpense},0,${"Transporte proveedor"},${note || `Gasto de compra con ${supplier || "proveedor"}`},now())`;
  }

  revalidateAdminAndStore(product.slug);
  redirect(`/admin/inventory?added=1&product=${productId}`);
}

export async function registerManualSale(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const size = cleanText(formData.get("size"), 30);
  const quantity = Math.max(1, Math.floor(Number(formData.get("quantity")) || 1));
  const requestedPrice = money(formData.get("unitPrice"));
  const requestedCost = money(formData.get("unitCost"));
  const saleExpense = money(formData.get("saleExpense"));
  const note = cleanText(formData.get("note"), 300);
  if (!productId || !size) throw new Error("Selecciona producto y talla.");

  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new Error("Producto no encontrado.");
  const unitPrice = requestedPrice || product.price;
  const unitCost = requestedCost || product.cost;
  const client = getSqlClient();

  await client.transaction((txn) => [
    txn`UPDATE product_variants SET stock_quantity=GREATEST(COALESCE(stock_quantity,0)-${quantity},0), stock_status=CASE WHEN GREATEST(COALESCE(stock_quantity,0)-${quantity},0)>0 THEN 'available' ELSE 'out_of_stock' END, updated_at=now() WHERE product_id=${productId}::uuid AND size=${size}`,
    txn`UPDATE products SET cost=${unitCost}, updated_at=now() WHERE id=${productId}::uuid`,
    txn`INSERT INTO inventory_movements (product_id,variant_id,product_name,size,movement_type,quantity,unit_cost,unit_price,note,created_at)
        VALUES (${productId}::uuid,(SELECT id FROM product_variants WHERE product_id=${productId}::uuid AND size=${size} LIMIT 1),${product.name},${size},'sale_manual',${quantity},${unitCost},${unitPrice},${note || "Venta cerrada por WhatsApp"},now())`,
  ]);

  if (saleExpense > 0) {
    await client`INSERT INTO inventory_movements (product_id,product_name,size,movement_type,quantity,unit_cost,unit_price,supplier,note,created_at)
      VALUES (${productId}::uuid,${product.name},${size},'expense',1,${saleExpense},0,${"Gasto de venta"},${note || "Gasto asociado a venta"},now())`;
  }

  revalidateAdminAndStore(product.slug);
  redirect(`/admin/sales?created=1&product=${productId}`);
}

export async function registerExpense(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const productId = cleanText(formData.get("productId"), 80);
  const category = cleanText(formData.get("category"), 80) || "Otro";
  const amount = money(formData.get("amount"));
  const note = cleanText(formData.get("note"), 300);
  if (!EXPENSE_CATEGORIES.has(category) || amount < 1) throw new Error("Completa un gasto válido.");

  let productName = "GASTO GENERAL";
  if (productId) {
    const [product] = await getDb().select({ name: products.name }).from(products).where(eq(products.id, productId)).limit(1);
    if (!product) throw new Error("Producto no encontrado.");
    productName = product.name;
  }

  const client = getSqlClient();
  await client`INSERT INTO inventory_movements (product_id,product_name,movement_type,quantity,unit_cost,unit_price,supplier,note,created_at)
    VALUES (${productId || null}::uuid,${productName},'expense',1,${amount},0,${category},${note || null},now())`;

  revalidateAdminAndStore();
  redirect(`/admin/sales?expense=1${productId ? `&product=${productId}` : ""}`);
}

export async function updateWhatsappNumber(formData: FormData) {
  await requireAdmin();
  const number = cleanText(formData.get("whatsappNumber"), 40).replace(/\D/g, "");
  const client = getSqlClient();
  await client`INSERT INTO store_settings (key,value,updated_at) VALUES ('whatsapp_number',${number},now()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`;
  revalidateAdminAndStore();
  redirect("/admin/products?whatsapp=1");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");
  const orderId = cleanText(formData.get("orderId"), 80);
  const paymentStatus = cleanText(formData.get("paymentStatus"), 30) || "pending";
  const orderStatus = cleanText(formData.get("orderStatus"), 30) || "received";
  const shippingStatus = cleanText(formData.get("shippingStatus"), 30) || "pending";
  const trackingNumber = cleanText(formData.get("trackingNumber"), 120) || null;
  if (!orderId || !["pending","paid","failed","refunded"].includes(paymentStatus) || !["received","confirmed","processing","shipped","delivered","cancelled"].includes(orderStatus) || !["pending","preparing","shipped","delivered","returned"].includes(shippingStatus)) throw new Error("Estado de pedido inválido.");
  await getDb().update(orders).set({ paymentStatus, orderStatus, shippingStatus, trackingNumber, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin"); revalidatePath("/admin/orders"); revalidatePath("/account");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const productId = cleanText(formData.get("productId"), 80);
  if (!productId) return;
  const active = cleanText(formData.get("active"), 10) === "true";
  await getDb().update(products).set({ active, updatedAt: new Date() }).where(eq(products.id, productId));
  revalidateAdminAndStore();
}
