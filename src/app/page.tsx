import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getFeaturedProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/shop?categoria=hombre", number: "01", title: "Hombre", note: "Selección diaria" },
  { href: "/shop?categoria=mujer", number: "02", title: "Mujer", note: "Selección diaria" },
  { href: "/shop?categoria=unisex", number: "03", title: "Unisex", note: "Sin etiquetas" },
];

export default async function Home() {
  const heroProduct = await getFeaturedProduct();

  return (
    <main className="home-page editorial-home">
      <SiteHeader />

      <section className="editorial-hero">
        <div className="editorial-hero-rail">
          <span>GIRTZ / EDIT 001</span>
          <span>MEDELLÍN · CO</span>
        </div>

        <div className="editorial-hero-copy">
          <p>CURATED SNEAKERS / 2026</p>
          <h1>NO SIGAS<br/>EL PAR.<br/><i>ENCUÉNTRALO.</i></h1>
          <div className="editorial-hero-actions">
            <Link href="/shop">VER SELECCIÓN</Link>
            <Link href="/cart">MI CARRITO</Link>
          </div>
        </div>

        <div className="editorial-hero-product">
          {heroProduct ? (
            <Link href={`/product/${heroProduct.slug}`} className="editorial-product-shot" aria-label={`Ver ${heroProduct.name}`}>
              <ProductVisual product={heroProduct} priority sizes="(max-width: 800px) 92vw, 56vw" />
              <span className="editorial-shot-index">01</span>
            </Link>
          ) : <div className="editorial-product-shot empty" />}

          <div className="editorial-product-meta">
            <div>
              <span>{heroProduct?.brand?.toUpperCase() || "GIRTZ"}</span>
              <h2>{heroProduct?.name || "NUEVA SELECCIÓN"}</h2>
            </div>
            <div className="editorial-product-price">
              <span>{heroProduct?.audience?.toUpperCase() || "UNISEX"}</span>
              <strong>{heroProduct ? formatCop(heroProduct.price) : "PRÓXIMAMENTE"}</strong>
            </div>
          </div>
        </div>

        <div className="editorial-scroll-note">DESLIZA PARA EXPLORAR <span>↓</span></div>
      </section>

      <section className="editorial-index">
        <header>
          <span>SHOP INDEX</span>
          <h2>TRES FORMAS<br/>DE ENTRAR.</h2>
        </header>

        <div className="editorial-index-list">
          {sections.map((section) => (
            <Link href={section.href} key={section.href} className="editorial-index-row">
              <span className="index-number">{section.number}</span>
              <strong>{section.title}</strong>
              <small>{section.note}</small>
              <span className="index-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-manifesto">
        <span>GIRTZ WEAR</span>
        <p>No vendemos una pared llena de referencias. Seleccionamos pares que valen la pena mirar dos veces.</p>
        <Link href="/shop">ENTRAR AL CATÁLOGO ↗</Link>
      </section>

      <SiteFooter />
    </main>
  );
}
