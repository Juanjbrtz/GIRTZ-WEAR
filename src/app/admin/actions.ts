"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { orders, products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/store-data";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const audience = String(formData.get("audience") || "").trim();
  const sku = String(formData.get("sku") || "").trim() || null;
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const price = Number(formData.get("price"));
  const cost = Number(formData.get("cost"));
  const stockQuantity = Math.max(0, Number(formData.get("stockQuantity") || 0));
  const rawSizes = String(formData.get("sizes") || "");
  const sizes = [...new Set(rawSizes.split(",").map((size) => size.trim()).filter(Boolean))];

  if (!name || !brand || !audience || !price || !cost || !imageUrl || !sizes.length) {
    throw new Error("Completa los campos obligatorios del producto.");
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

  const [created] = await db
    .insert(products)
    .values({
      name,
      slug,
      brand,
      audience,
      sku,
      description,
      price,
      cost,
      category: "Sneakers",
      imageUrl,
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
    })
    .returning({ id: products.id });

  if (!created) {
    throw new Error("No fue posible crear el producto.");
  }

  await db.insert(productVariants).values(
    sizes.map((size) => ({
      productId: created.id,
      size,
      sku: sku ? `${sku}-${size.replace(/\s+/g, "")}` : null,
      stockStatus: stockQuantity > 0 ? "available" : "out_of_stock",
      stockQuantity,
    })),
  );

  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products?created=1");
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

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}
