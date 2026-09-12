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
    <main className="inner-page product-inner-page product-page-v3-shell">
      <SiteHeader />
      <section className="product-page product-page-v3">
        <div className="product-detail-media product-detail-media-v3">
          <ProductVisual product={product} priority sizes="(max-width: 900px) 100vw, 58vw" />
          <span className="product-detail-category">{product.audience}</span>
          {product.featured ? <span className="product-detail-featured">DESTACADO</span> : null}
        </div>
        <div className="product-detail product-detail-v3">
          <div className="product-detail-topline"><span>{product.brand.toUpperCase()} / {product.audience.toUpperCase()}</span><Link href={`/shop?categoria=${product.audience.toLowerCase()}`}>VOLVER AL CATÁLOGO</Link></div>
          <h1>{product.name}</h1>
          <div className="product-price product-price-v3">{formatCop(product.price)} <small>+ envío</small></div>
          <p className="product-description">{product.description}</p>
          <div className="availability-card-v3"><div><span className="availability-dot" /><strong>DISPONIBILIDAD SUJETA A CONFIRMACIÓN</strong></div><p>Agrega el modelo a tu selección. En el carrito podrás enviar todo por WhatsApp para confirmar talla, disponibilidad y envío antes de cerrar la compra.</p></div>
          <div className="product-actions product-buy-actions product-actions-v3 product-actions-final">
            <AddToCartButton product={product} />
            <Link href="/cart" className="secondary-button">VER CARRITO</Link>
          </div>
          <div className="product-detail-benefits-v3"><div><strong>01</strong><span>Arma tu selección.</span></div><div><strong>02</strong><span>Envíala completa por WhatsApp.</span></div><div><strong>03</strong><span>Confirmamos disponibilidad y cerramos contigo.</span></div></div>
        </div>
      </section>
    </main>
  );
}
