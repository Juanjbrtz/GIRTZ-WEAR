import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productTable, productVariants } from "@/db/schema";
import type { Audience, Product } from "@/data/products";
import { isDatabaseConfigured } from "@/lib/store-data";

function normalizeAudience(value: string | null): Audience {
  if (value === "Hombre" || value === "Mujer" || value === "Unisex") return value;
  return "Unisex";
}

function sortSizes(sizes: string[]) {
  return [...new Set(sizes)].sort((a, b) => {
    const numberA = Number.parseFloat(a.replace(",", "."));
    const numberB = Number.parseFloat(b.replace(",", "."));
    if (Number.isFinite(numberA) && Number.isFinite(numberB)) return numberA - numberB;
    return a.localeCompare(b, "es", { numeric: true });
  });
}

function mapProduct(row: typeof productTable.$inferSelect, sizes: string[] = []): Product {
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
    sizes: sortSizes(sizes),
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

    if (!rows.length) return [];

    const variants = await db
      .select({ productId: productVariants.productId, size: productVariants.size })
      .from(productVariants)
      .where(and(
        inArray(productVariants.productId, rows.map((row) => row.id)),
        ne(productVariants.stockStatus, "hidden"),
      ));

    const sizesByProduct = new Map<string, string[]>();
    for (const variant of variants) {
      const current = sizesByProduct.get(variant.productId) || [];
      current.push(variant.size);
      sizesByProduct.set(variant.productId, current);
    }

    return rows.map((row) => mapProduct(row, sizesByProduct.get(row.id) || []));
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

    if (!row) return null;

    const variants = await db
      .select({ size: productVariants.size })
      .from(productVariants)
      .where(and(
        eq(productVariants.productId, row.id),
        ne(productVariants.stockStatus, "hidden"),
      ));

    return mapProduct(row, variants.map((variant) => variant.size));
  } catch {
    return null;
  }
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const products = await getCatalogProducts();
  return products.find((product) => product.featured) || products[0] || null;
}
