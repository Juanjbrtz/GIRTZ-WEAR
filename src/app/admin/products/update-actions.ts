"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { DEFAULT_EUR_SIZES } from "@/lib/sizes";
import { isDatabaseConfigured } from "@/lib/store-data";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function money(value: FormDataEntryValue | null) {
  return Math.max(0, Math.round(Number(String(value || "").replace(/\D/g, "")) || 0));
}

function getSizes(formData: FormData) {
  const selected = new Set(formData.getAll("sizes").map((value) => String(value).trim()));
  return DEFAULT_EUR_SIZES.filter((size) => selected.has(size));
}

function getImageFile(formData: FormData) {
  const value = formData.get("image");
  if (!value || typeof value === "string" || value.size === 0) return null;
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
    DO UPDATE SET filename=EXCLUDED.filename, content_type=EXCLUDED.content_type, image_data=EXCLUDED.image_data, updated_at=now()
  `;
}

function revalidateProductAreas(slug: string) {
  for (const path of ["/", "/shop", "/cart", "/admin", "/admin/products", "/admin/inventory", "/admin/sales"]) {
    revalidatePath(path);
  }
  revalidatePath(`/product/${slug}`);
}

export async function updateProductWithSizes(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("El servicio de productos no está disponible en este momento.");

  const productId = cleanText(formData.get("productId"), 80);
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

  if (!productId || !name || price < 100) throw new Error("Completa nombre y precio.");
  if (!sizes.length) throw new Error("Selecciona al menos una talla EUR entre 35 y 46.");
  if (!["Hombre", "Mujer", "Unisex"].includes(audience)) throw new Error("Sección inválida.");

  const db = getDb();
  const [current] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!current) throw new Error("Producto no encontrado.");

  const existingVariants = await db.select().from(productVariants).where(eq(productVariants.productId, productId));
  const selectedSet = new Set(sizes);

  if (featured) {
    await db.update(products).set({ featured: false, updatedAt: new Date() });
  }

  await db.update(products).set({
    name,
    brand,
    audience,
    description: description || "Referencia disponible por pedido. Confirma disponibilidad antes de cerrar la compra por WhatsApp.",
    price,
    cost,
    imageUrl: `/api/product-image/${productId}`,
    featured,
    active,
    updatedAt: new Date(),
  }).where(eq(products.id, productId));

  for (const size of sizes) {
    await db.insert(productVariants).values({
      productId,
      size,
      stockStatus: "available",
      stockQuantity: null,
    }).onConflictDoUpdate({
      target: [productVariants.productId, productVariants.size],
      set: { stockStatus: "available", updatedAt: new Date() },
    });
  }

  for (const variant of existingVariants) {
    if (!selectedSet.has(variant.size)) {
      await db.update(productVariants)
        .set({ stockStatus: "hidden", updatedAt: new Date() })
        .where(eq(productVariants.id, variant.id));
    }
  }

  if (image) await saveProductImage(productId, image);

  revalidateProductAreas(current.slug);
  redirect(`/admin/products/${productId}/edit?saved=1`);
}
