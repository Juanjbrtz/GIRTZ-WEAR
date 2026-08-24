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
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 45vw, 25vw"
        />
        <span className="product-badge">{product.eyebrow}</span>
        <span className="product-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.sizes.slice(0, 5).join(" · ")} +</p>
        </div>
        <strong>{formatCop(product.price)}</strong>
      </div>
    </article>
  );
}
