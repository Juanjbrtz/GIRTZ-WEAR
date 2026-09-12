import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product; whatsappNumber?: string }) {
  return (
    <article className="product-card product-card-v3 product-card-v4 product-card-final">
      <Link href={`/product/${product.slug}`} className="product-media product-media-v3 product-media-v4">
        <ProductVisual product={product} sizes="(max-width: 720px) 50vw, (max-width: 1100px) 46vw, 25vw" />
        <span className="product-audience product-audience-v4">{product.audience}</span>
        {product.featured ? <span className="product-featured-badge product-featured-badge-v4">DESTACADO</span> : null}
      </Link>
      <div className="product-info product-info-v3 product-info-v4">
        <div className="product-heading-row product-heading-row-v4">
          <div><p className="product-kicker">{product.brand}</p><h3>{product.name}</h3></div>
          <strong>{formatCop(product.price)}</strong>
        </div>
        <div className="availability-line"><span className="availability-dot" />DISPONIBILIDAD SUJETA A CONFIRMACIÓN</div>
        <div className="product-card-actions-final"><AddToCartButton product={product} className="product-cart-button" /></div>
        <Link href={`/product/${product.slug}`} className="product-detail-link-v3 product-detail-link-v4">VER DETALLES DEL MODELO <span>→</span></Link>
      </div>
    </article>
  );
}
