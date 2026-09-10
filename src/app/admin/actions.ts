"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

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
  const active = formData.get("active") !== "off";

  if (!name || !price || !image) throw new Error("Completa foto, nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const baseSlug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, baseSlug)).limit(1);
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });

  const [created] = await db
    .insert(products)
    .values({
      name,
      slug,
      brand,
      audience,
      description: description || "",
      price,
      cost,
      category: "Sneakers",
      imageUrl: null,
      featured,
      active,
    })
    .returning({ id: products.id });

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
  const rows = await sql`
    INSERT INTO product_variants (product_id, size, stock_status, stock_quantity, created_at, updated_at)
    VALUES (${productId}::uuid, ${size}, 'available', ${quantity}, now(), now())
    ON CONFLICT (product_id, size)
    DO UPDATE SET
      stock_quantity = COALESCE(product_variants.stock_quantity, 0) + EXCLUDED.stock_quantity,
      stock_status = 'available',
      updated_at = now()
    RETURNING id
  `;
  const variantId = String(rows[0]?.id || "");

  if (unitCost > 0) {
    await db.update(products).set({ cost: unitCost, updatedAt: new Date() }).where(eq(products.id, productId));
  }

  await sql`
    INSERT INTO inventory_movements (
      product_id, variant_id, product_name, size, movement_type, quantity, unit_cost, unit_price, supplier, note, created_at
    ) VALUES (
      ${productId}::uuid, ${variantId}::uuid, ${product.name}, ${size}, 'purchase', ${quantity}, ${unitCost}, ${product.price}, ${supplier || null}, ${note || null}, now()
    )
  `;

  revalidateStorefront(product.slug);
  redirect(`/admin/inventory?added=1&product=${productId}`);
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

  const orderId = String(formData.get("orderId") || "");
  const paymentStatus = String(formData.get("paymentStatus") || "pending");
  const orderStatus = String(formData.get("orderStatus") || "received");
  const shippingStatus = String(formData.get("shippingStatus") || "pending");
  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;

  if (!orderId) throw new Error("Pedido inválido.");
  const db = getDb();
  await db.update(orders).set({ paymentStatus, orderStatus, shippingStatus, trackingNumber, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  revalidatePath("/account");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const active = String(formData.get("active")) === "true";
  const db = getDb();
  await db.update(products).set({ active, updatedAt: new Date() }).where(eq(products.id, productId));
  revalidateStorefront();
}
