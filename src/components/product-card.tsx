import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product, index = 0 }: { product: Product; whatsappNumber?: string; index?: number }) {
  const sequence = String(index + 1).padStart(2, "0");

  return (
    <article className="product-card product-card-v3 product-card-v4 product-card-final editorial-product-card refined-product-card">
      <Link href={`/product/${product.slug}`} className="product-media product-media-v3 product-media-v4 editorial-card-media refined-card-media">
        <ProductVisual product={product} sizes="(max-width: 900px) 50vw, 50vw" />
        <span className="editorial-card-sequence">{sequence}</span>
        <span className="product-audience product-audience-v4">{product.audience}</span>
        {product.featured ? <span className="product-featured-badge product-featured-badge-v4">DESTACADO</span> : null}
      </Link>

      <div className="product-info product-info-v3 product-info-v4 editorial-card-info refined-card-info">
        <p className="product-kicker refined-card-brand">{product.brand}</p>
        <h3 className="refined-card-name">{product.name}</h3>
        <strong className="refined-card-price">{formatCop(product.price)}</strong>

        <div className="refined-card-status">
          <span className="availability-dot" />
          <span>Disponibilidad por confirmar</span>
        </div>

        <div className="refined-card-links">
          <Link href={`/product/${product.slug}`}>VER MODELO</Link>
          <span>↗</span>
        </div>

        <div className="product-card-actions-final editorial-card-actions refined-card-actions">
          <AddToCartButton product={product} className="product-cart-button" />
        </div>
      </div>
    </article>
  );
}
