import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Audience } from "@/data/products";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Catálogo de sneakers GIRTZ WEAR con tallas y disponibilidad de inventario.",
};

type ShopPageProps = {
  searchParams: Promise<{ categoria?: string; marca?: string }>;
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

function brandHref(category: string, brand?: string) {
  const params = new URLSearchParams();
  if (category !== "todos") params.set("categoria", category);
  if (brand) params.set("marca", brand);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [{ categoria, marca }, catalogProducts] = await Promise.all([
    searchParams,
    getCatalogProducts(),
  ]);

  const activeCategory = categoria && categoryMap[categoria] ? categoria : "todos";
  const audience = categoryMap[activeCategory];
  const categoryProducts = audience
    ? catalogProducts.filter((product) => product.audience === audience)
    : catalogProducts;
  const brands = [...new Set(categoryProducts.map((product) => product.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  const activeBrand = marca && brands.includes(marca) ? marca : "";
  const visibleProducts = activeBrand
    ? categoryProducts.filter((product) => product.brand === activeBrand)
    : categoryProducts;

  return (
    <main className="inner-page catalog-page catalog-page-v3">
      <SiteHeader />
      <section className="catalog-shell catalog-shell-v3">
        <div className="catalog-heading catalog-heading-v3">
          <div>
            <span className="eyebrow">GIRTZ WEAR</span>
            <h1>ENCUENTRA<br />TU PRÓXIMO PAR.</h1>
          </div>
          <div className="catalog-intro-v3">
            <p>Elige tu modelo y talla. Agrega al carrito y compra en línea.</p>
          </div>
        </div>

        <nav className="catalog-filters catalog-filters-v3" aria-label="Filtrar por sección">
          {filters.map((filter) => (
            <Link key={filter.value} href={filter.href} className={activeCategory === filter.value ? "active" : undefined}>
              {filter.label}
            </Link>
          ))}
        </nav>

        {brands.length > 1 ? (
          <div className="brand-filter-shell">
            <div className="brand-filter-title"><span>MARCA</span><strong>{activeBrand || "TODAS"}</strong></div>
            <nav className="brand-filter-row" aria-label="Filtrar por marca">
              <Link href={brandHref(activeCategory)} className={!activeBrand ? "active" : undefined}>TODAS</Link>
              {brands.map((brand) => (
                <Link key={brand} href={brandHref(activeCategory, brand)} className={activeBrand === brand ? "active" : undefined}>
                  {brand.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}

        <div className="catalog-result-bar catalog-result-bar-v3">
          <span>{activeCategory === "todos" ? "CATÁLOGO" : categoryMap[activeCategory].toUpperCase()}{activeBrand ? ` / ${activeBrand.toUpperCase()}` : ""}</span>
          <span>{visibleProducts.length} MODELOS</span>
        </div>

        {visibleProducts.length ? (
          <div className="product-grid catalog-grid product-grid-v3">
            {visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty-v3">
            <span className="eyebrow">GIRTZ WEAR</span>
            <h2>NUEVAS REFERENCIAS MUY PRONTO.</h2>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
