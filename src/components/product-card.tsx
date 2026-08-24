import Image from "next/image";
import Link from "next/link";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-media">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          unoptimized
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

        <div className="product-sizes" aria-label={`Tallas disponibles para ${product.name}`}>
          {product.sizes.slice(0, 6).map((size) => (
            <span key={size}>{size}</span>
          ))}
          {product.sizes.length > 6 ? <span>+{product.sizes.length - 6}</span> : null}
        </div>

        <Link href={`/product/${product.slug}`} className="product-link">
          VER PRODUCTO
        </Link>
      </div>
    </article>
  );
}
