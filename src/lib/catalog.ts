import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productTable } from "@/db/schema";
import type { Audience, Product } from "@/data/products";
import { isDatabaseConfigured } from "@/lib/store-data";

function normalizeAudience(value: string | null): Audience {
  if (value === "Hombre" || value === "Mujer" || value === "Unisex") return value;
  return "Unisex";
}

function mapProduct(row: typeof productTable.$inferSelect): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand || "GIRTZ",
    audience: normalizeAudience(row.audience),
    price: row.price,
    image: row.imageUrl
      ? `${row.imageUrl}${row.imageUrl.includes("?") ? "&" : "?"}v=${row.updatedAt.getTime()}`
      : `/api/product-image/${row.id}?v=${row.updatedAt.getTime()}`,
    imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
    sizes: [],
    description:
      row.description ||
      "Referencia seleccionada por GIRTZ WEAR. Consulta disponibilidad de tallas por WhatsApp.",
    featured: row.featured,
  };
}

export async function getCatalogProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(productTable)
      .where(eq(productTable.active, true))
      .orderBy(desc(productTable.featured), desc(productTable.updatedAt));

    return rows.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(productTable)
      .where(and(eq(productTable.slug, slug), eq(productTable.active, true)))
      .limit(1);

    return row ? mapProduct(row) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const products = await getCatalogProducts();
  return products.find((product) => product.featured) || products[0] || null;
}
