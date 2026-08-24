import Image from "next/image";
import Link from "next/link";
import { IntroMark } from "@/components/intro-mark";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/data/products";

const statements = ["CURATED SNEAKERS", "COLOMBIA", "DROP CULTURE", "MOVE DIFFERENT"];

export default function Home() {
  return (
    <main>
      <IntroMark />
      <SiteHeader />

      <section className="hero-shell">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="live-dot" />
            DROP 001 / COLOMBIA
          </div>
          <h1>
            MOVE
            <br />
            <em>DIFFERENT.</em>
          </h1>
          <p>
            Sneakers seleccionados para construir rotación, presencia y calle.
            Menos ruido. Mejores pares.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="primary-button">
              EXPLORAR DROP <span aria-hidden="true">↗</span>
            </Link>
            <a href="#about" className="text-link">
              CONOCER GIRTZ <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Sneakers destacados de GIRTZ WEAR">
          <Image
            src={products[0].image}
            alt={products[0].imageAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <div className="hero-overlay" />
          <span className="hero-number">001</span>
          <div className="hero-product-label">
            <span>SELECTED / 01</span>
            <strong>{products[0].name}</strong>
          </div>
          <div className="hero-scroll">SCROLL TO DISCOVER ↓</div>
        </div>
      </section>

      <section className="ticker" aria-label="Identidad GIRTZ WEAR">
        <div className="ticker-track">
          {[...statements, ...statements].map((statement, index) => (
            <span key={`${statement}-${index}`}>
              {statement} <b>✦</b>
            </span>
          ))}
        </div>
      </section>

      <section className="drop-section" id="drop">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / SELECTED</span>
            <h2>PRIMER DROP</h2>
          </div>
          <p>
            Una selección corta para empezar bien. Referencias con carácter,
            combinables y listas para entrar en tu rotación.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="section-action">
          <Link href="/shop" className="outline-button">
            VER TODO EL CATÁLOGO <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="manifesto" id="about">
        <div className="manifesto-label">02 / WHY GIRTZ</div>
        <div className="manifesto-copy">
          <span>NO VENDEMOS RUIDO.</span>
          <h2>
            PARES QUE SE SIENTEN
            <br />
            <em>COMO TU PRÓXIMO FAVORITO.</em>
          </h2>
          <p>
            GIRTZ WEAR nace para seleccionar sneakers con una mirada simple:
            buena presencia, referencias que sí usarías y una experiencia de
            compra clara de principio a fin.
          </p>
        </div>
      </section>

      <section className="benefit-grid" aria-label="Beneficios de comprar en GIRTZ WEAR">
        <article>
          <span>01</span>
          <h3>SELECCIÓN CURADA</h3>
          <p>No cientos de referencias. Empezamos con pares que vale la pena mirar.</p>
        </article>
        <article>
          <span>02</span>
          <h3>COMPRA CLARA</h3>
          <p>Tallas, precios, disponibilidad y condiciones sin letra pequeña.</p>
        </article>
        <article>
          <span>03</span>
          <h3>ACOMPAÑAMIENTO</h3>
          <p>WhatsApp y seguimiento para que siempre sepas qué pasa con tu pedido.</p>
        </article>
      </section>

      <section className="final-cta">
        <span>DROP 001 / AVAILABLE SOON</span>
        <h2>
          TU PRÓXIMO PAR
          <br />
          <em>EMPIEZA AQUÍ.</em>
        </h2>
        <Link href="/shop" className="primary-button light">
          ENTRAR AL SHOP <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
