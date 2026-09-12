import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getFeaturedProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const catalogRoutes = [
  {
    href: "/shop?categoria=hombre",
    index: "01",
    title: "HOMBRE",
    description: "Sneakers seleccionados para hombre.",
  },
  {
    href: "/shop?categoria=mujer",
    index: "02",
    title: "MUJER",
    description: "Una selección pensada para mujer.",
  },
  {
    href: "/shop?categoria=unisex",
    index: "03",
    title: "UNISEX",
    description: "Modelos versátiles para todos los estilos.",
  },
];

export default async function Home() {
  const heroProduct = await getFeaturedProduct();

  return (
    <main className="home-page home-page-v3 home-page-v4">
      <SiteHeader />

      <section className={`home-hero-v4 ${heroProduct ? "has-featured" : ""}`}>
        {heroProduct ? (
          <Link href={`/product/${heroProduct.slug}`} className="home-hero-art-v4" aria-label={`Ver ${heroProduct.name}`}>
            <ProductVisual product={heroProduct} priority sizes="100vw" />
            <span className="home-hero-shade-v4" />
          </Link>
        ) : null}

        <div className="home-hero-copy-v4">
          <span className="eyebrow">GIRTZ WEAR / COLOMBIA</span>
          <h1>SNEAKERS<br />QUE HABLAN<br />POR TI.</h1>
          <p>Una selección multimarca pensada para encontrar tu próximo par sin complicaciones.</p>
          <div className="home-hero-actions-v4">
            <Link href="/shop" className="primary-button">VER CATÁLOGO</Link>
            <Link href="/cart" className="secondary-button">MI SELECCIÓN</Link>
          </div>
        </div>

        {heroProduct ? (
          <div className="home-hero-product-v4">
            <span>DESTACADO</span>
            <div className="home-hero-product-line-v4">
              <div>
                <small>{heroProduct.brand.toUpperCase()} / {heroProduct.audience.toUpperCase()}</small>
                <h2>{heroProduct.name}</h2>
              </div>
              <strong>{formatCop(heroProduct.price)}</strong>
            </div>
            <Link href={`/product/${heroProduct.slug}`}>VER MODELO →</Link>
          </div>
        ) : (
          <div className="home-hero-product-v4 empty">
            <span>GIRTZ WEAR</span>
            <h2>NUEVA SELECCIÓN.</h2>
            <Link href="/shop">EXPLORAR →</Link>
          </div>
        )}
      </section>

      <section className="home-discovery-v3 home-discovery-v4">
        <div className="home-discovery-head-v3 home-discovery-head-v4">
          <span className="eyebrow">EXPLORA</span>
          <h2>ENCUENTRA TU ESTILO.</h2>
        </div>

        <div className="home-category-grid-v3 home-category-grid-v4">
          {catalogRoutes.map((item) => (
            <Link key={item.href} href={item.href} className="home-category-card-v3 home-category-card-v4">
              <span>{item.index}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <strong>EXPLORAR →</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
