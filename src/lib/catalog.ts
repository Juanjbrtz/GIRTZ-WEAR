import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productTable, productVariants } from "@/db/schema";
import type { Audience, Product, ProductVariant } from "@/data/products";
import { isDatabaseConfigured } from "@/lib/store-data";

function normalizeAudience(value: string | null): Audience {
  if (value === "Hombre" || value === "Mujer" || value === "Unisex") return value;
  return "Unisex";
}

function imageFor(row: typeof productTable.$inferSelect) {
  return `/api/product-image/${row.id}?v=${row.updatedAt.getTime()}`;
}

function mapProduct(
  row: typeof productTable.$inferSelect,
  variants: Array<typeof productVariants.$inferSelect>,
): Product {
  const mappedVariants: ProductVariant[] = variants
    .filter((variant) => variant.productId === row.id)
    .map((variant) => {
      const stockQuantity = Math.max(0, variant.stockQuantity || 0);
      return {
        id: variant.id,
        size: variant.size,
        stockQuantity,
        available: variant.stockStatus !== "out_of_stock" && stockQuantity > 0,
      };
    })
    .sort((a, b) => a.size.localeCompare(b.size, "es", { numeric: true }));

  const availableVariants = mappedVariants.filter((variant) => variant.available);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand || "GIRTZ",
    audience: normalizeAudience(row.audience),
    price: row.price,
    cost: row.cost,
    image: imageFor(row),
    imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
    sizes: availableVariants.map((variant) => variant.size),
    variants: mappedVariants,
    stockQuantity: mappedVariants.reduce((sum, variant) => sum + variant.stockQuantity, 0),
    description: row.description || "Sneaker disponible en GIRTZ WEAR.",
    featured: row.featured,
  };
}

export async function getCatalogProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const db = getDb();
    const [rows, variants] = await Promise.all([
      db
        .select()
        .from(productTable)
        .where(eq(productTable.active, true))
        .orderBy(desc(productTable.featured), desc(productTable.updatedAt)),
      db.select().from(productVariants),
    ]);

    return rows.map((row) => mapProduct(row, variants));
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
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, row.id));

    return mapProduct(row, variants);
  } catch {
    return null;
  }
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const catalog = await getCatalogProducts();
  return catalog.find((product) => product.featured) || catalog[0] || null;
}
