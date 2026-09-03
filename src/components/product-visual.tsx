import Image from "next/image";
import type { Product } from "@/data/products";

export function ProductVisual({
  product,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!product.image) {
    return (
      <div
        className={`product-visual-fallback ${className}`.trim()}
        role="img"
        aria-label={product.imageAlt}
      >
        <span>GIRTZ WEAR</span>
        <small>IMAGEN PENDIENTE</small>
      </div>
    );
  }

  return (
    <Image
      src={product.image}
      alt={product.imageAlt}
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={`product-visual-image ${className}`.trim()}
    />
  );
}
