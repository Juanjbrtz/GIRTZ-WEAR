import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappConsultButton } from "@/components/whatsapp-consult-button";
import { formatCop } from "@/data/products";
import { getFeaturedProduct } from "@/lib/catalog";
import { getWhatsappNumber } from "@/lib/store-settings";

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
  const [heroProduct, whatsappNumber] = await Promise.all([
    getFeaturedProduct(),
    getWhatsappNumber(),
  ]);

  return (
    <main className="home-page home-page-v3">
      <SiteHeader />

      <section className="home-hero-v3">
        <div className="home-hero-copy-v3">
          <span className="eyebrow">GIRTZ WEAR / COLOMBIA</span>
          <h1>SNEAKERS QUE HABLAN POR TI.</h1>
          <p>
            Descubre nuestra selección multimarca y encuentra tu próximo par.
          </p>

          <div className="home-hero-actions-v3">
            <Link href="/shop" className="primary-button">
              VER CATÁLOGO
            </Link>
            <Link href="/cart" className="secondary-button">
              MI SELECCIÓN
            </Link>
          </div>
        </div>

        <div className="home-featured-v3">
          {heroProduct ? (
            <>
              <Link href={`/product/${heroProduct.slug}`} className="home-featured-media-v3">
                <ProductVisual
                  product={heroProduct}
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <span className="home-featured-tag">DESTACADO</span>
              </Link>
              <div className="home-featured-info-v3">
                <div>
                  <span>{heroProduct.brand.toUpperCase()} / {heroProduct.audience.toUpperCase()}</span>
                  <h2>{heroProduct.name}</h2>
                </div>
                <strong>{formatCop(heroProduct.price)}</strong>
              </div>
              <WhatsappConsultButton
                product={heroProduct}
                whatsappNumber={whatsappNumber}
                className="whatsapp-button home-whatsapp-v3"
                label="CONSULTAR DISPONIBILIDAD"
              />
            </>
          ) : (
            <div className="home-featured-empty-v3">
              <span className="eyebrow">GIRTZ WEAR</span>
              <h2>NUEVA SELECCIÓN.</h2>
              <p>Muy pronto encontrarás aquí nuestros modelos destacados.</p>
            </div>
          )}
        </div>
      </section>

      <section className="home-discovery-v3">
        <div className="home-discovery-head-v3">
          <span className="eyebrow">EXPLORA</span>
          <h2>ENCUENTRA TU ESTILO.</h2>
        </div>

        <div className="home-category-grid-v3">
          {catalogRoutes.map((item) => (
            <Link key={item.href} href={item.href} className="home-category-card-v3">
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>VER →</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
