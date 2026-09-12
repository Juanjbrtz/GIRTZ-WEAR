import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product, index = 0 }: { product: Product; whatsappNumber?: string; index?: number }) {
  const sequence = String(index + 1).padStart(2, "0");

  return (
    <article className="product-card product-card-v3 product-card-v4 product-card-final editorial-product-card">
      <Link href={`/product/${product.slug}`} className="product-media product-media-v3 product-media-v4 editorial-card-media">
        <ProductVisual product={product} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 46vw, 32vw" />
        <span className="editorial-card-sequence">{sequence}</span>
        <span className="product-audience product-audience-v4">{product.audience}</span>
        {product.featured ? <span className="product-featured-badge product-featured-badge-v4">GIRTZ PICK</span> : null}
      </Link>

      <div className="product-info product-info-v3 product-info-v4 editorial-card-info">
        <div className="editorial-card-titleline">
          <div>
            <p className="product-kicker">{product.brand}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatCop(product.price)}</strong>
        </div>

        <div className="editorial-card-rule">
          <span>DISPONIBILIDAD POR CONFIRMAR</span>
          <Link href={`/product/${product.slug}`}>VER PAR ↗</Link>
        </div>

        <div className="product-card-actions-final editorial-card-actions">
          <AddToCartButton product={product} className="product-cart-button" />
        </div>
      </div>
    </article>
  );
}
