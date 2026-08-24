import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productTable, productVariants } from "@/db/schema";
import {
  products as demoProducts,
  type Audience,
  type Product,
} from "@/data/products";
import { isDatabaseConfigured } from "@/lib/store-data";

function normalizeAudience(value: string | null): Audience {
  if (value === "Hombre" || value === "Mujer" || value === "Unisex") {
    return value;
  }
  return "Unisex";
}

export async function getCatalogProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return demoProducts;

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(productTable)
      .where(eq(productTable.active, true))
      .orderBy(desc(productTable.featured), desc(productTable.createdAt));

    if (!rows.length) return demoProducts;

    const variants = await db.select().from(productVariants);

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      brand: row.brand || "MULTIMARCA",
      audience: normalizeAudience(row.audience),
      price: row.price,
      image: row.imageUrl || demoProducts[0].image,
      imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
      sizes: variants
        .filter((variant) => variant.productId === row.id && variant.stockStatus !== "out_of_stock")
        .map((variant) => variant.size),
      description: row.description || "Referencia seleccionada por GIRTZ WEAR.",
    }));
  } catch {
    return demoProducts;
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
          brand: row.brand || "MULTIMARCA",
          audience: normalizeAudience(row.audience),
          price: row.price,
          image: row.imageUrl || demoProducts[0].image,
          imageAlt: `${row.brand || "Sneaker"} ${row.name}`,
          sizes: variants
            .filter((variant) => variant.stockStatus !== "out_of_stock")
            .map((variant) => variant.size),
          description: row.description || "Referencia seleccionada por GIRTZ WEAR.",
        };
      }
    } catch {
      // La tienda pública mantiene los demos si Neon no está disponible.
    }
  }

  return demoProducts.find((product) => product.slug === slug) || null;
}
