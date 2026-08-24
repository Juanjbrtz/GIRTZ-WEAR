import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/data/products";

const catalogRoutes = [
  {
    href: "/shop",
    index: "01",
    title: "CATÁLOGO",
    description: "Explora todas las referencias disponibles.",
  },
  {
    href: "/shop?categoria=hombre",
    index: "02",
    title: "HOMBRE",
    description: "Sneakers seleccionados para hombre.",
  },
  {
    href: "/shop?categoria=mujer",
    index: "03",
    title: "MUJER",
    description: "Referencias seleccionadas para mujer.",
  },
  {
    href: "/shop?categoria=unisex",
    index: "04",
    title: "UNISEX",
    description: "Siluetas versátiles sin categoría cerrada.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <SiteHeader />

      <section className="home-stage">
        <div className="home-visual">
          <Image
            src={products[0].image}
            alt={products[0].imageAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <div className="home-visual-overlay" />

          <div className="home-editorial">
            <span className="eyebrow">GIRTZ WEAR / COLOMBIA</span>
            <h1>
              SNEAKERS
              <br />
              CON PRESENCIA.
            </h1>
            <p>
              Una selección multimarca pensada para encontrar mejores pares sin
              perder tiempo entre cientos de referencias.
            </p>
          </div>

          <div className="home-visual-meta">
            <span>CATÁLOGO CURADO</span>
            <span>HOMBRE · MUJER · UNISEX</span>
          </div>
        </div>

        <div className="home-navigation">
          <div className="home-navigation-head">
            <span className="eyebrow">EXPLORA GIRTZ</span>
            <h2>¿QUÉ ESTÁS BUSCANDO?</h2>
            <p>
              Entra directamente a la sección que necesitas. Sin recorridos
              innecesarios.
            </p>
          </div>

          <nav className="category-navigation" aria-label="Accesos al catálogo">
            {catalogRoutes.map((item) => (
              <Link key={item.href} href={item.href} className="category-navigation-item">
                <span className="category-index">{item.index}</span>
                <span className="category-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="category-action">VER</span>
              </Link>
            ))}
          </nav>

          <div className="home-service-note">
            <div>
              <strong>COMPRA CLARA</strong>
              <span>Tallas y precios visibles desde el catálogo.</span>
            </div>
            <div>
              <strong>ATENCIÓN DIRECTA</strong>
              <span>Acompañamiento para disponibilidad y pedido.</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
