import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Audience } from "@/data/products";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora el catálogo multimarca de sneakers GIRTZ WEAR para hombre, mujer y unisex.",
};

type ShopPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

const filters = [
  { label: "TODOS", value: "todos", href: "/shop" },
  { label: "HOMBRE", value: "hombre", href: "/shop?categoria=hombre" },
  { label: "MUJER", value: "mujer", href: "/shop?categoria=mujer" },
  { label: "UNISEX", value: "unisex", href: "/shop?categoria=unisex" },
];

const categoryMap: Record<string, Audience> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [{ categoria }, catalogProducts] = await Promise.all([
    searchParams,
    getCatalogProducts(),
  ]);
  const activeCategory = categoria && categoryMap[categoria] ? categoria : "todos";
  const audience = categoryMap[activeCategory];
  const visibleProducts = audience
    ? catalogProducts.filter((product) => product.audience === audience)
    : catalogProducts;

  return (
    <main className="inner-page catalog-page">
      <SiteHeader />

      <section className="catalog-shell">
        <div className="catalog-heading">
          <div>
            <span className="eyebrow">GIRTZ WEAR / MULTIMARCA</span>
            <h1>CATÁLOGO</h1>
          </div>
          <p>
            Una selección reducida para comprar mejor. Filtra por categoría y
            entra directamente a cada referencia para revisar tallas y detalles.
          </p>
        </div>

        <nav className="catalog-filters" aria-label="Filtrar catálogo por categoría">
          {filters.map((filter) => (
            <Link
              key={filter.value}
              href={filter.href}
              className={activeCategory === filter.value ? "active" : undefined}
            >
              {filter.label}
            </Link>
          ))}
        </nav>

        <div className="catalog-result-bar">
          <span>
            {activeCategory === "todos"
              ? "TODAS LAS REFERENCIAS"
              : categoryMap[activeCategory].toUpperCase()}
          </span>
          <span>{visibleProducts.length} PRODUCTOS</span>
        </div>

        <div className="product-grid catalog-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
