"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { products, productVariants } from "@/db/schema";
import { DEFAULT_EUR_SIZES } from "@/lib/sizes";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function money(value: FormDataEntryValue | null) {
  return Math.max(0, Math.round(Number(String(value || "").replace(/\D/g, "")) || 0));
}

function getImageFile(formData: FormData) {
  const value = formData.get("image");
  if (!value || typeof value === "string" || value.size === 0) throw new Error("Debes seleccionar una foto para el producto.");
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) throw new Error("La foto debe ser JPG, PNG, WebP o AVIF.");
  if (value.size > MAX_IMAGE_BYTES) throw new Error("La foto supera el límite de 7 MB.");
  return value;
}

function getSizes(formData: FormData) {
  const selected = new Set(formData.getAll("sizes").map((value) => String(value).trim()));
  return DEFAULT_EUR_SIZES.filter((size) => selected.has(size));
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

export async function createProductWithSizes(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("El servicio de productos no está disponible en este momento.");

  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = money(formData.get("price"));
  const cost = money(formData.get("cost"));
  const image = getImageFile(formData);
  const sizes = getSizes(formData);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const submissionKey = cleanText(formData.get("submissionKey"), 100) || randomUUID();

  if (!name || price < 100 || !image) throw new Error("Completa foto, nombre y precio.");
  if (!sizes.length) throw new Error("Selecciona al menos una talla EUR.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const baseSlug = slugify(`${brand}-${name}`) || "producto";
  const keySlug = slugify(submissionKey) || randomUUID().replace(/-/g, "");
  const slug = `${baseSlug}-${keySlug}`;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  if (existing) redirect("/admin/products?duplicate=1");

  if (featured) await db.update(products).set({ featured: false, updatedAt: new Date() });
  const [created] = await db.insert(products).values({
    name,
    slug,
    brand,
    audience,
    sku: null,
    description: description || "Referencia disponible por pedido. Confirma disponibilidad antes de cerrar la compra por WhatsApp.",
    price,
    cost,
    category: "Sneakers",
    imageUrl: null,
    featured,
    active,
  }).returning({ id: products.id });

  if (!created) throw new Error("No fue posible crear el producto.");

  await db.insert(productVariants).values(
    sizes.map((size) => ({
      productId: created.id,
      size,
      stockStatus: "available",
      stockQuantity: null,
    })),
  ).onConflictDoNothing();

  await saveProductImage(created.id, image);
  await db.update(products).set({ imageUrl: `/api/product-image/${created.id}`, updatedAt: new Date() }).where(eq(products.id, created.id));
  revalidateAdminAndStore(slug);
  redirect("/admin/products?created=1");
}
