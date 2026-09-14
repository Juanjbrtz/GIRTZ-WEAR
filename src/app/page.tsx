import Link from "next/link";
import { CartOpenButton } from "@/components/cart-open-button";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getFeaturedProduct } from "@/lib/catalog";
import "./pwa-polish.css";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/shop?categoria=hombre", number: "01", title: "Hombre", note: "Ver modelos" },
  { href: "/shop?categoria=mujer", number: "02", title: "Mujer", note: "Ver modelos" },
  { href: "/shop?categoria=unisex", number: "03", title: "Unisex", note: "Ver modelos" },
];

const serviceNotes = [
  { number: "01", title: "Multimarca", text: "Modelos de distintas marcas en un solo catálogo." },
  { number: "02", title: "Disponibilidad", text: "Confirmamos talla y disponibilidad por WhatsApp." },
  { number: "03", title: "Compra", text: "Coordinamos contigo el cierre y el envío del pedido." },
];

export default async function Home() {
  const heroProduct = await getFeaturedProduct();

  return (
    <main className="home-page editorial-home refined-home">
      <SiteHeader />

      <section className={`editorial-hero refined-hero${heroProduct ? "" : " refined-hero--empty"}`}>
        <div className="editorial-hero-rail editorial-hero-rail-clean">
          <span>GIRTZ / CATÁLOGO 2026</span>
        </div>

        <div className="editorial-hero-copy refined-hero-copy">
          <p>SNEAKERS MULTIMARCA</p>
          <h1>ENCUENTRA<br/>TU PRÓXIMO PAR.</h1>
          <span className="refined-hero-description">Explora el catálogo, agrega tus favoritos y confirma disponibilidad por WhatsApp.</span>
          <div className="editorial-hero-actions">
            <Link href="/shop">VER CATÁLOGO</Link>
            <CartOpenButton>MI CARRITO</CartOpenButton>
          </div>
          {!heroProduct ? (
            <div className="refined-empty-catalog-note">
              <strong>CATÁLOGO EN ACTUALIZACIÓN</strong>
              Estamos preparando nuevas referencias. Puedes volver pronto para ver los modelos disponibles.
            </div>
          ) : null}
        </div>

        {heroProduct ? (
          <div className="editorial-hero-product refined-hero-product">
            <Link href={`/product/${heroProduct.slug}`} className="editorial-product-shot" aria-label={`Ver ${heroProduct.name}`}>
              <ProductVisual product={heroProduct} priority sizes="(max-width: 800px) 92vw, 56vw" />
              <span className="editorial-shot-index">01</span>
            </Link>

            <div className="editorial-product-meta">
              <div>
                <span>{heroProduct.brand?.toUpperCase() || "GIRTZ"}</span>
                <h2>{heroProduct.name}</h2>
              </div>
              <div className="editorial-product-price">
                <span>{heroProduct.audience?.toUpperCase() || "UNISEX"}</span>
                <strong>{formatCop(heroProduct.price)}</strong>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="refined-category-section">
        <header className="refined-section-head">
          <span>CATÁLOGO</span>
          <h2>Explora por sección.</h2>
          <p>Encuentra modelos para hombre, mujer y unisex.</p>
        </header>

        <div className="refined-category-list">
          {sections.map((section) => (
            <Link href={section.href} key={section.href} className="refined-category-row">
              <span>{section.number}</span>
              <strong>{section.title}</strong>
              <small>{section.note}</small>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="refined-service-strip" aria-label="Cómo comprar en GIRTZ Wear">
        {serviceNotes.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
