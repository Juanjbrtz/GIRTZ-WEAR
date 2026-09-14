"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getSqlClient } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

function cleanId(value: FormDataEntryValue | null) {
  return String(value || "").trim().slice(0, 80);
}

function revalidateProductAreas(slug?: string) {
  for (const path of ["/", "/shop", "/cart", "/admin", "/admin/products", "/admin/inventory", "/admin/sales"]) {
    revalidatePath(path);
  }
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function archiveProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("El servicio no está disponible en este momento.");

  const productId = cleanId(formData.get("productId"));
  if (!productId) redirect("/admin/products?missing=1");

  const db = getDb();
  const [product] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) redirect("/admin/products?missing=1");

  await db
    .update(products)
    .set({ active: false, featured: false, updatedAt: new Date() })
    .where(eq(products.id, productId));

  revalidateProductAreas(product.slug);
  redirect("/admin/products?archived=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  if (!isDatabaseConfigured()) throw new Error("El servicio no está disponible en este momento.");

  const productId = cleanId(formData.get("productId"));
  if (!productId) redirect("/admin/products?missing=1");

  const db = getDb();
  const [product] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) redirect("/admin/products?missing=1");

  const sql = getSqlClient();
  const usage = await sql`
    SELECT
      EXISTS(SELECT 1 FROM order_items WHERE product_id = ${productId}::uuid) AS has_orders,
      EXISTS(SELECT 1 FROM inventory_movements WHERE product_id = ${productId}::uuid) AS has_movements
  `;

  const hasHistory = Boolean(usage[0]?.has_orders || usage[0]?.has_movements);

  if (hasHistory) {
    await db
      .update(products)
      .set({ active: false, featured: false, updatedAt: new Date() })
      .where(eq(products.id, productId));

    revalidateProductAreas(product.slug);
    redirect("/admin/products?archivedHistory=1");
  }

  await db.delete(products).where(eq(products.id, productId));
  revalidateProductAreas(product.slug);
  redirect("/admin/products?deleted=1");
}
