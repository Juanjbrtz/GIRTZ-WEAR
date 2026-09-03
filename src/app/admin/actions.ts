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

  if (!ALLOWED_IMAGE_TYPES.has(value.type)) {
    throw new Error("La imagen debe ser JPG, PNG, WebP o AVIF.");
  }

  if (value.size > MAX_IMAGE_BYTES) {
    throw new Error("La imagen supera el límite de 7 MB.");
  }

  return value;
}

async function saveProductImage(productId: string, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const encoded = bytes.toString("base64");
  const sql = getSqlClient();

  await sql`
    INSERT INTO product_images (
      product_id,
      filename,
      content_type,
      image_data,
      updated_at
    ) VALUES (
      ${productId}::uuid,
      ${file.name || "producto"},
      ${file.type || "image/jpeg"},
      decode(${encoded}, 'base64'),
      now()
    )
    ON CONFLICT (product_id)
    DO UPDATE SET
      filename = EXCLUDED.filename,
      content_type = EXCLUDED.content_type,
      image_data = EXCLUDED.image_data,
      updated_at = now()
  `;
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80);
  const audience = cleanText(formData.get("audience"), 20);
  const description = cleanText(formData.get("description"), 1200);
  const price = Math.round(Number(formData.get("price")) || 0);
  const image = getImageFile(formData, "image", true);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!name || !brand || !price || !image) {
    throw new Error("Completa nombre, marca, precio e imagen.");
  }

  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) {
    throw new Error("Categoría de público inválida.");
  }

  const db = getDb();
  const baseSlug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, baseSlug))
    .limit(1);
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  if (featured) {
    await db.update(products).set({ featured: false, updatedAt: new Date() });
  }

  const [created] = await db
    .insert(products)
    .values({
      name,
      slug,
      brand,
      audience,
      sku: null,
      description:
        description ||
        "Consulta la disponibilidad de tallas de esta referencia directamente por WhatsApp.",
      price,
      cost: 0,
      category: "Sneakers",
      imageUrl: null,
      featured,
      active,
    })
    .returning({ id: products.id });

  if (!created) throw new Error("No fue posible crear el producto.");

  await saveProductImage(created.id, image);
  await db
    .update(products)
    .set({
      imageUrl: `/api/product-image/${created.id}`,
      updatedAt: new Date(),
    })
    .where(eq(products.id, created.id));

  revalidateStorefront(slug);
  redirect("/admin/products?created=1");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const productId = cleanText(formData.get("productId"), 80);
  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80);
  const audience = cleanText(formData.get("audience"), 20);
  const description = cleanText(formData.get("description"), 1200);
  const price = Math.round(Number(formData.get("price")) || 0);
  const image = getImageFile(formData, "image", false);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!productId || !name || !brand || !price) {
    throw new Error("Completa los datos obligatorios del producto.");
  }

  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) {
    throw new Error("Categoría de público inválida.");
  }

  const db = getDb();
  const [current] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!current) throw new Error("Producto no encontrado.");

  if (featured) {
    await db.update(products).set({ featured: false, updatedAt: new Date() });
  }

  await db
    .update(products)
    .set({
      name,
      brand,
      audience,
      description:
        description ||
        "Consulta la disponibilidad de tallas de esta referencia directamente por WhatsApp.",
      price,
      cost: 0,
      imageUrl: `/api/product-image/${productId}`,
      featured,
      active,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  if (image) await saveProductImage(productId, image);

  revalidateStorefront(current.slug);
  redirect(`/admin/products/${productId}/edit?saved=1`);
}

export async function updateWhatsappNumber(formData: FormData) {
  await requireAdmin();

  const number = cleanText(formData.get("whatsappNumber"), 40).replace(/\D/g, "");
  const sql = getSqlClient();

  await sql`
    INSERT INTO store_settings (key, value, updated_at)
    VALUES ('whatsapp_number', ${number}, now())
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/admin/products");
  redirect("/admin/products?whatsapp=1");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const orderId = String(formData.get("orderId") || "");
  const paymentStatus = String(formData.get("paymentStatus") || "pending");
  const orderStatus = String(formData.get("orderStatus") || "received");
  const shippingStatus = String(formData.get("shippingStatus") || "pending");
  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;

  const allowedPayment = ["pending", "paid", "failed", "refunded"];
  const allowedOrder = ["received", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const allowedShipping = ["pending", "preparing", "shipped", "delivered", "returned"];

  if (
    !orderId ||
    !allowedPayment.includes(paymentStatus) ||
    !allowedOrder.includes(orderStatus) ||
    !allowedShipping.includes(shippingStatus)
  ) {
    throw new Error("Estado de pedido inválido.");
  }

  const db = getDb();
  await db
    .update(orders)
    .set({
      paymentStatus,
      orderStatus,
      shippingStatus,
      trackingNumber,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const productId = String(formData.get("productId") || "");
  const active = String(formData.get("active")) === "true";

  const db = getDb();
  await db
    .update(products)
    .set({ active, updatedAt: new Date() })
    .where(eq(products.id, productId));

  revalidateStorefront();
}
