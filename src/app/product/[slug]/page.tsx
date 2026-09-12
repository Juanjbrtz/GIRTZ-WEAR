import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getCatalogProductBySlug } from "@/lib/catalog";

type ProductPageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  return product ? { title: `${product.name} | GIRTZ WEAR`, description: product.description } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="inner-page editorial-product-page">
      <SiteHeader />

      <section className="editorial-detail">
        <div className="editorial-detail-image">
          <ProductVisual product={product} priority sizes="(max-width: 900px) 100vw, 62vw" />
          <span className="editorial-detail-code">{product.featured ? "MODELO DESTACADO" : "CATÁLOGO"}</span>
          <span className="editorial-detail-audience">{product.audience}</span>
        </div>

        <aside className="editorial-detail-info">
          <div className="editorial-detail-topline">
            <span>{product.brand.toUpperCase()}</span>
            <Link href={`/shop?categoria=${product.audience.toLowerCase()}`}>VOLVER ↗</Link>
          </div>

          <h1>{product.name}</h1>
          <div className="editorial-detail-price">{formatCop(product.price)} <small>+ envío</small></div>
          <p className="editorial-detail-description">{product.description}</p>

          <div className="editorial-detail-availability">
            <span>01</span>
            <div><strong>DISPONIBILIDAD</strong><p>Confirmamos la talla disponible por WhatsApp antes de cerrar la compra.</p></div>
          </div>
          <div className="editorial-detail-availability">
            <span>02</span>
            <div><strong>CARRITO</strong><p>Agrega uno o varios modelos y revisa tu selección antes de consultar.</p></div>
          </div>
          <div className="editorial-detail-availability">
            <span>03</span>
            <div><strong>COMPRA</strong><p>Envía tu carrito por WhatsApp para coordinar disponibilidad, pago y envío.</p></div>
          </div>

          <div className="editorial-detail-actions">
            <AddToCartButton product={product} />
            <Link href="/cart">VER CARRITO ↗</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
