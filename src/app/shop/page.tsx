import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Audience } from "@/data/products";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catálogo", description: "Explora sneakers multimarca en GIRTZ WEAR y confirma disponibilidad por WhatsApp." };
type ShopPageProps = { searchParams: Promise<{ categoria?: string; marca?: string }> };
const filters = [
  { label: "Todo", value: "todos", href: "/shop" },
  { label: "Hombre", value: "hombre", href: "/shop?categoria=hombre" },
  { label: "Mujer", value: "mujer", href: "/shop?categoria=mujer" },
  { label: "Unisex", value: "unisex", href: "/shop?categoria=unisex" },
];
const categoryMap: Record<string, Audience> = { hombre: "Hombre", mujer: "Mujer", unisex: "Unisex" };
function brandHref(category: string, brand?: string) { const params = new URLSearchParams(); if (category !== "todos") params.set("categoria", category); if (brand) params.set("marca", brand); const query = params.toString(); return query ? `/shop?${query}` : "/shop"; }

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [{ categoria, marca }, catalogProducts] = await Promise.all([searchParams, getCatalogProducts()]);
  const activeCategory = categoria && categoryMap[categoria] ? categoria : "todos";
  const audience = categoryMap[activeCategory];
  const categoryProducts = audience ? catalogProducts.filter((product) => product.audience === audience) : catalogProducts;
  const brands = [...new Set(categoryProducts.map((product) => product.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const activeBrand = marca && brands.includes(marca) ? marca : "";
  const visibleProducts = activeBrand ? categoryProducts.filter((product) => product.brand === activeBrand) : categoryProducts;

  return (
    <main className="inner-page catalog-page editorial-shop">
      <SiteHeader />

      <section className="editorial-shop-head">
        <div className="editorial-shop-title">
          <span>CATÁLOGO / {String(visibleProducts.length).padStart(2, "0")}</span>
          <h1>SNEAKERS<br/>MULTIMARCA.</h1>
        </div>
        <p>Explora modelos para hombre, mujer y unisex. Agrega tus favoritos al carrito y confirma talla, disponibilidad y envío por WhatsApp.</p>
      </section>

      <section className="editorial-filter-bar">
        <nav aria-label="Filtrar catálogo por sección">
          {filters.map((filter) => (
            <Link key={filter.value} href={filter.href} className={activeCategory === filter.value ? "active" : undefined}>{filter.label}</Link>
          ))}
        </nav>

        {brands.length ? (
          <nav className="editorial-brand-nav" aria-label="Filtrar catálogo por marca">
            <span>Marca</span>
            <Link href={brandHref(activeCategory)} className={!activeBrand ? "active" : undefined}>Todas</Link>
            {brands.map((brand) => <Link key={brand} href={brandHref(activeCategory, brand)} className={activeBrand === brand ? "active" : undefined}>{brand}</Link>)}
          </nav>
        ) : null}
      </section>

      <section className="editorial-catalog-meta">
        <span>{activeCategory === "todos" ? "Todos los modelos" : categoryMap[activeCategory]}</span>
        <span>{activeBrand || "Todas las marcas"}</span>
        <span>{visibleProducts.length} {visibleProducts.length === 1 ? "referencia" : "referencias"}</span>
      </section>

      {visibleProducts.length ? (
        <section className="editorial-product-grid">
          {visibleProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}
        </section>
      ) : (
        <section className="editorial-empty"><span>CATÁLOGO</span><h2>SIN RESULTADOS<br/>POR AHORA.</h2><Link href="/shop">VER TODO EL CATÁLOGO ↗</Link></section>
      )}

      <SiteFooter />
    </main>
  );
}
