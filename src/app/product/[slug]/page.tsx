import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getCatalogProductBySlug } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.name} | GIRTZ WEAR`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="inner-page product-inner-page">
      <SiteHeader />

      <section className="product-page">
        <div className="product-detail-media">
          <ProductVisual
            product={product}
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <span className="product-detail-category">{product.audience}</span>
        </div>

        <div className="product-detail">
          <div className="product-detail-topline">
            <span>
              {product.catalogReference || "GIRTZ"} / {product.audience.toUpperCase()}
            </span>
            <Link href={`/shop?categoria=${product.audience.toLowerCase()}`}>
              VOLVER AL CATÁLOGO
            </Link>
          </div>

          <h1>{product.name}</h1>
          <div className="product-price">{formatCop(product.price)} + envío</div>
          <p className="product-description">{product.description}</p>

          <div className="product-divider" />

          <div className="size-block">
            <div className="size-title-row">
              <span>TALLA</span>
              <small>La disponibilidad se confirma antes del despacho.</small>
            </div>
            <div className="size-grid" aria-label={`Tallas para ${product.name}`}>
              {product.sizes.length ? (
                product.sizes.map((size) => <span key={size}>{size}</span>)
              ) : (
                <small>Consultar disponibilidad de talla.</small>
              )}
            </div>
          </div>

          <div className="product-actions product-buy-actions">
            <AddToCartButton product={product} />
            <AddToCartButton product={product} buyNow className="secondary-button" />
          </div>

          <div className="product-secondary-links">
            <Link href="/shipping">INFORMACIÓN DE ENVÍO</Link>
            <Link href="/contact">¿NECESITAS AYUDA?</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
