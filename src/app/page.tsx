import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappConsultButton } from "@/components/whatsapp-consult-button";
import { formatCop } from "@/data/products";
import { getCatalogProducts, getFeaturedProduct } from "@/lib/catalog";
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
    description: "Referencias seleccionadas para mujer.",
  },
  {
    href: "/shop?categoria=unisex",
    index: "03",
    title: "UNISEX",
    description: "Modelos versátiles para distintos estilos.",
  },
];

export default async function Home() {
  const [heroProduct, catalogProducts, whatsappNumber] = await Promise.all([
    getFeaturedProduct(),
    getCatalogProducts(),
    getWhatsappNumber(),
  ]);
  const brandCount = new Set(catalogProducts.map((product) => product.brand)).size;

  return (
    <main className="home-page home-page-v3">
      <SiteHeader />

      <section className="home-hero-v3">
        <div className="home-hero-copy-v3">
          <span className="eyebrow">GIRTZ WEAR / COLOMBIA</span>
          <h1>ENCUENTRA EL PAR QUE HABLA POR TI.</h1>
          <p>
            Sneakers multimarca, fotografías reales y una compra más simple:
            guarda tus favoritos y consulta tallas directamente por WhatsApp.
          </p>

          <div className="home-hero-actions-v3">
            <Link href="/shop" className="primary-button">
              EXPLORAR CATÁLOGO
            </Link>
            <Link href="/cart" className="secondary-button">
              VER MI SELECCIÓN
            </Link>
          </div>

          <div className="home-stats-v3">
            <div><strong>{catalogProducts.length}</strong><span>MODELOS PUBLICADOS</span></div>
            <div><strong>{brandCount}</strong><span>MARCAS</span></div>
            <div><strong>1:1</strong><span>ATENCIÓN POR WHATSAPP</span></div>
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
                <span className="home-featured-tag">PRODUCTO DESTACADO</span>
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
                label="CONSULTAR TALLAS DEL DESTACADO"
              />
            </>
          ) : (
            <div className="home-featured-empty-v3">
              <span className="eyebrow">PORTADA ADMINISTRABLE</span>
              <h2>ELIGE EL PRODUCTO DESTACADO DESDE /ADMIN.</h2>
              <p>
                Cuando publiques un producto como destacado, su fotografía aparecerá aquí en alta calidad.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="home-discovery-v3">
        <div className="home-discovery-head-v3">
          <span className="eyebrow">EXPLORA POR SECCIÓN</span>
          <h2>TRES FORMAS DE EMPEZAR.</h2>
        </div>

        <div className="home-category-grid-v3">
          {catalogRoutes.map((item) => (
            <Link key={item.href} href={item.href} className="home-category-card-v3">
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>VER CATÁLOGO →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-process-v3">
        <div>
          <span>01</span>
          <strong>ELIGE</strong>
          <p>Explora por sección o marca y guarda los modelos que te interesan.</p>
        </div>
        <div>
          <span>02</span>
          <strong>CONSULTA</strong>
          <p>Envía el carrito por WhatsApp y pregunta por las tallas disponibles.</p>
        </div>
        <div>
          <span>03</span>
          <strong>COORDINA</strong>
          <p>Confirmamos disponibilidad y envío contigo antes de cerrar la compra.</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
