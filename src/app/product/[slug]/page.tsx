import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchaseControls } from "@/components/product-purchase-controls";
import { ProductVisual } from "@/components/product-visual";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getCatalogProductBySlug } from "@/lib/catalog";

type ProductPageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description || `${product.name} en GIRTZ WEAR` };
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
          <div className="product-detail-topline">
            <span>{product.brand.toUpperCase()} / {product.audience.toUpperCase()}</span>
            <Link href={`/shop?categoria=${product.audience.toLowerCase()}`}>VOLVER</Link>
          </div>

          <h1>{product.name}</h1>
          <div className="product-price product-price-v3">{formatCop(product.price)}</div>
          {product.description ? <p className="product-description">{product.description}</p> : null}

          <div className="product-inventory-block">
            <div className="product-inventory-head">
              <span>TALLAS DISPONIBLES</span>
              <strong>{product.stockQuantity} unidades</strong>
            </div>
            <div className="product-size-stock-grid">
              {product.variants.filter((variant) => variant.available).map((variant) => (
                <span key={variant.id}><b>{variant.size}</b><small>{variant.stockQuantity}</small></span>
              ))}
              {!product.stockQuantity ? <span className="product-out-message">AGOTADO</span> : null}
            </div>
          </div>

          <ProductPurchaseControls product={product} />

          <div className="product-secondary-links">
            <Link href="/shipping">ENVÍOS</Link>
            <Link href="/returns">CAMBIOS</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
