import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productTable, productVariants } from "@/db/schema";
import { approvedCatalogProducts } from "@/data/catalog-approved";
import type { Audience, Product } from "@/data/products";
import { isDatabaseConfigured } from "@/lib/store-data";

function normalizeAudience(value: string | null): Audience {
  if (value === "Hombre" || value === "Mujer" || value === "Unisex") return value;
  return "Unisex";
}

function dbProductImage(value: string | null) {
  return value || "/api/catalog-image/hombre";
}

export async function getCatalogProducts(): Promise<Product[]> {
  const approved = approvedCatalogProducts;
  if (!isDatabaseConfigured()) return approved;

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(productTable)
      .where(eq(productTable.active, true))
      .orderBy(desc(productTable.featured), desc(productTable.createdAt));

    if (!rows.length) return approved;

    const variants = await db.select().from(productVariants);
    const adminProducts: Product[] = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      brand: row.brand || "SELECCIÓN GIRTZ",
      audience: normalizeAudience(row.audience),
      price: row.price,
      image: dbProductImage(row.imageUrl),
      imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
      sizes: variants
        .filter((variant) => variant.productId === row.id && variant.stockStatus !== "out_of_stock")
        .map((variant) => variant.size),
      description: row.description || "Referencia seleccionada por GIRTZ WEAR.",
    }));

    const adminSlugs = new Set(adminProducts.map((product) => product.slug));
    return [...adminProducts, ...approved.filter((product) => !adminSlugs.has(product.slug))];
  } catch {
    return approved;
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | null> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [row] = await db
        .select()
        .from(productTable)
        .where(and(eq(productTable.slug, slug), eq(productTable.active, true)))
        .limit(1);

      if (row) {
        const variants = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, row.id));

        return {
          slug: row.slug,
          name: row.name,
          brand: row.brand || "SELECCIÓN GIRTZ",
          audience: normalizeAudience(row.audience),
          price: row.price,
          image: dbProductImage(row.imageUrl),
          imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
          sizes: variants
            .filter((variant) => variant.stockStatus !== "out_of_stock")
            .map((variant) => variant.size),
          description: row.description || "Referencia seleccionada por GIRTZ WEAR.",
        };
      }
    } catch {
      // El catálogo aprobado permanece disponible aunque Neon esté temporalmente fuera de servicio.
    }
  }

  return approvedCatalogProducts.find((product) => product.slug === slug) || null;
}
