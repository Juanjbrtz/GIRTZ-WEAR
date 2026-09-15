import Link from "next/link";
import { BrandMark } from "@/components/brand-logo";
import { CartOpenButton } from "@/components/cart-open-button";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts, getFeaturedProduct } from "@/lib/catalog";
import { getCatalogUpdateSettings } from "@/lib/store-settings";
import "./pwa-polish.css";
import "./home-iconography.css";

export const dynamic = "force-dynamic";

type HomeIcon = "man" | "woman" | "unisex" | "brand" | "available" | "bag";

const sections: Array<{ href: string; icon: HomeIcon; title: string; note: string }> = [
  { href: "/shop?categoria=hombre", icon: "man", title: "Hombre", note: "Ver modelos" },
  { href: "/shop?categoria=mujer", icon: "woman", title: "Mujer", note: "Ver modelos" },
  { href: "/shop?categoria=unisex", icon: "unisex", title: "Unisex", note: "Ver modelos" },
];

const serviceNotes: Array<{ icon: HomeIcon; title: string; text: string }> = [
  { icon: "brand", title: "Multimarca", text: "Modelos de distintas marcas en un solo catálogo." },
  { icon: "available", title: "Disponibilidad", text: "Confirmamos talla y disponibilidad por WhatsApp." },
  { icon: "bag", title: "Compra", text: "Coordinamos contigo el cierre y el envío del pedido." },
];

function FeatureIcon({ icon }: { icon: HomeIcon }) {
  if (icon === "brand") {
    return <span className="home-brand-icon"><BrandMark className="girtz-mark--feature" /></span>;
  }

  if (icon === "available") {
    return (
      <svg className="home-feature-icon" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="11" />
        <path d="m10.5 16 3.5 3.5 7.5-8" />
      </svg>
    );
  }

  if (icon === "bag") {
    return (
      <svg className="home-feature-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 11h16l-1 14H9L8 11Z" />
        <path d="M12 11V9a4 4 0 0 1 8 0v2" />
      </svg>
    );
  }

  if (icon === "unisex") {
    return (
      <svg className="home-feature-icon home-feature-icon--people" viewBox="0 0 40 32" aria-hidden="true">
        <circle cx="13" cy="9" r="4" />
        <path d="M5 27c.8-7 3.5-10.5 8-10.5S20.2 20 21 27" />
        <circle cx="28" cy="9" r="4" />
        <path d="M20 27c.8-7 3.5-10.5 8-10.5S35.2 20 36 27" />
      </svg>
    );
  }

  if (icon === "woman") {
    return (
      <svg className="home-feature-icon" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="8.5" r="4" />
        <path d="M8.5 27c.8-7 3.3-10.8 7.5-10.8S22.7 20 23.5 27" />
        <path d="M11.5 8.5c.4-5 8.6-5 9 0M12 12.5l-2 5M20 12.5l2 5" />
      </svg>
    );
  }

  return (
    <svg className="home-feature-icon" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="8.5" r="4" />
      <path d="M8 27c.8-7 3.5-10.8 8-10.8S23.2 20 24 27" />
      <path d="M11 18h10" />
    </svg>
  );
}

export default async function Home() {
  const [heroProduct, catalogProducts, catalogUpdate] = await Promise.all([
    getFeaturedProduct(),
    getCatalogProducts(),
    getCatalogUpdateSettings(),
  ]);
  const hasCatalog = catalogProducts.length > 0;
  const showCatalogUpdate = !hasCatalog || catalogUpdate.forceNotice;

  return (
    <main className="home-page editorial-home refined-home">
      <SiteHeader />

      <section className={`editorial-hero refined-hero featured-cover-hero${heroProduct ? " featured-cover-hero--active" : " refined-hero--empty"}`}>
        {heroProduct ? (
          <Link
            href={`/product/${heroProduct.slug}`}
            className="featured-cover-media"
            aria-label={`Ver producto destacado ${heroProduct.name}`}
          >
            <ProductVisual product={heroProduct} priority sizes="100vw" />
            <span className="featured-cover-shade" aria-hidden="true" />
          </Link>
        ) : null}

        <div className="editorial-hero-rail editorial-hero-rail-clean">
          <span>GIRTZ / CATÁLOGO 2026</span>
        </div>

        <div className="editorial-hero-copy refined-hero-copy featured-cover-copy">
          <p>SNEAKERS MULTIMARCA</p>
          <h1 className="featured-cover-title">
            <span>ENCUENTRA</span>
            <span>TU PRÓXIMO</span>
            <span>PAR.</span>
          </h1>
          <span className="refined-hero-description">Explora el catálogo, agrega tus favoritos y confirma disponibilidad por WhatsApp.</span>
          <div className="editorial-hero-actions">
            <Link href="/shop">VER CATÁLOGO</Link>
            <CartOpenButton>MI CARRITO</CartOpenButton>
          </div>
          {showCatalogUpdate ? (
            <div className="refined-empty-catalog-note" role="status">
              <strong>CATÁLOGO EN ACTUALIZACIÓN</strong>
              {catalogUpdate.message}
            </div>
          ) : null}
        </div>
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
              <span className="home-icon-slot"><FeatureIcon icon={section.icon} /></span>
              <strong>{section.title}</strong>
              <small>{section.note}</small>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="refined-service-strip" aria-label="Cómo comprar en GIRTZ Wear">
        {serviceNotes.map((item) => (
          <article key={item.title}>
            <span className="home-service-icon"><FeatureIcon icon={item.icon} /></span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
