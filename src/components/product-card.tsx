import Link from "next/link";
import { ProductPurchaseControls } from "@/components/product-purchase-controls";
import { ProductVisual } from "@/components/product-visual";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card product-card-v3 commerce-product-card">
      <Link href={`/product/${product.slug}`} className="product-media product-media-v3">
        <ProductVisual
          product={product}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 25vw"
        />
        <span className="product-audience">{product.audience}</span>
        {product.featured ? <span className="product-featured-badge">DESTACADO</span> : null}
      </Link>

      <div className="product-info product-info-v3">
        <div className="product-heading-row">
          <div>
            <p className="product-kicker">{product.brand}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatCop(product.price)}</strong>
        </div>

        <div className="product-stock-line">
          {product.stockQuantity > 0 ? "DISPONIBLE" : "AGOTADO"}
        </div>

        <div className="product-size-preview" aria-label={`Tallas EUR disponibles de ${product.name}`}>
          {product.sizes.length ? product.sizes.slice(0, 7).map((size) => <span key={size}>{size}</span>) : <span>—</span>}
        </div>

        <ProductPurchaseControls product={product} compact />

        <Link href={`/product/${product.slug}`} className="product-detail-link-v3">
          VER PRODUCTO
        </Link>
      </div>
    </article>
  );
}
