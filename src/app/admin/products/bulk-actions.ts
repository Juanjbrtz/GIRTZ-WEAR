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
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function money(value: FormDataEntryValue | null) {
  return Math.max(0, Math.round(Number(String(value || "").replace(/\D/g, "")) || 0));
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
  const client = getSqlClient();
  await client`INSERT INTO product_images (product_id,filename,content_type,image_data,updated_at)
    VALUES (${productId}::uuid,${file.name || "producto"},${file.type || "image/jpeg"},decode(${encoded},'base64'),now())
    ON CONFLICT (product_id) DO UPDATE SET filename=EXCLUDED.filename,content_type=EXCLUDED.content_type,image_data=EXCLUDED.image_data,updated_at=now()`;
}

function revalidateCatalog() {
  for (const path of ["/", "/shop", "/admin", "/admin/products", "/admin/inventory", "/admin/sales"]) revalidatePath(path);
}

export async function createProductFromBatch(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured");

  const image = getImage(formData);
  const name = cleanText(formData.get("name"), 140);
  const brand = cleanText(formData.get("brand"), 80) || "GIRTZ";
  const audience = cleanText(formData.get("audience"), 20) || "Unisex";
  const price = money(formData.get("price"));
  const cost = money(formData.get("cost"));
  if (!name || price < 100) throw new Error("Cada foto necesita nombre y precio válido.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const slug = slugify(`${brand}-${name}`) || `producto-${Date.now()}`;
  const [existing] = await db.select({ id: products.id, name: products.name }).from(products).where(eq(products.slug, slug)).limit(1);
  if (existing) return { ok: true, id: existing.id, name: existing.name, duplicate: true };

  try {
    const [created] = await db.insert(products).values({
      name, slug, brand, audience, price, cost, category: "Sneakers", imageUrl: null,
      description: "Referencia disponible por pedido. Confirma disponibilidad antes de cerrar la compra por WhatsApp.",
      featured: false, active: true,
    }).returning({ id: products.id });
    if (!created) throw new Error("No fue posible crear el producto.");
    await saveProductImage(created.id, image);
    await db.update(products).set({ imageUrl: `/api/product-image/${created.id}`, updatedAt: new Date() }).where(eq(products.id, created.id));
    revalidateCatalog();
    return { ok: true, id: created.id, name, duplicate: false };
  } catch (error) {
    const [alreadyCreated] = await db.select({ id: products.id, name: products.name }).from(products).where(eq(products.slug, slug)).limit(1);
    if (alreadyCreated) return { ok: true, id: alreadyCreated.id, name: alreadyCreated.name, duplicate: true };
    throw error;
  }
}
