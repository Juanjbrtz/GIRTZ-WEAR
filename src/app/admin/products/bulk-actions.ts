"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, getSqlClient } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getImage(formData: FormData) {
  const value = formData.get("image");
  if (!value || typeof value === "string" || value.size === 0) throw new Error("Falta la foto del producto.");
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) throw new Error("La foto debe ser JPG, PNG, WebP o AVIF.");
  if (value.size > MAX_IMAGE_BYTES) throw new Error("La foto supera el límite de 7 MB.");
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

export async function createProductFromBatch(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const image = getImage(formData);
  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const description = cleanText(formData.get("description"), 1200);
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const cost = Math.max(0, Math.round(Number(formData.get("cost")) || 0));

  if (!name || !price) throw new Error("Cada foto necesita nombre y precio.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const baseSlug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, baseSlug)).limit(1);
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

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
    featured: false,
    active: true,
  }).returning({ id: products.id });

  if (!created) throw new Error("No fue posible crear el producto.");
  await saveProductImage(created.id, image);
  await db.update(products).set({ updatedAt: new Date() }).where(eq(products.id, created.id));

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");

  return { ok: true, id: created.id, name };
}
