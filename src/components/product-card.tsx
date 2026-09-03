import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-media">
        <ProductVisual
          product={product}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 25vw"
        />
        <span className="product-audience">{product.audience}</span>
      </Link>

      <div className="product-info">
        <div className="product-heading-row">
          <div>
            <p className="product-kicker">{product.brand}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatCop(product.price)}</strong>
        </div>

        <div className="product-size-label">TALLAS</div>
        <div className="product-sizes" aria-label={`Tallas para ${product.name}`}>
          {product.sizes.length ? (
            <>
              {product.sizes.slice(0, 6).map((size) => (
                <span key={size}>{size}</span>
              ))}
              {product.sizes.length > 6 ? <span>+{product.sizes.length - 6}</span> : null}
            </>
          ) : (
            <span className="size-on-request">CONSULTAR</span>
          )}
        </div>

        <div className="product-card-actions">
          <Link href={`/product/${product.slug}`} className="product-link">
            VER PRODUCTO
          </Link>
          <AddToCartButton product={product} className="product-cart-button" />
        </div>
      </div>
    </article>
  );
}
