import Image from "next/image";
import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

function spriteStyle(product: Product): CSSProperties | undefined {
  if (!product.sprite) return undefined;

  const { index, columns, rows, src } = product.sprite;
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = columns <= 1 ? 0 : (column / (columns - 1)) * 100;
  const y = rows <= 1 ? 0 : (row / (rows - 1)) * 100;

  return {
    backgroundImage: `url(${src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  };
}

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
  if (product.sprite) {
    return (
      <div
        className={`product-visual-sprite ${className}`.trim()}
        style={spriteStyle(product)}
        role="img"
        aria-label={product.imageAlt}
      />
    );
  }

  if (!product.image) {
    return (
      <div
        className={`product-visual-fallback ${className}`.trim()}
        role="img"
        aria-label={product.imageAlt}
      >
        <span>GIRTZ WEAR</span>
        <small>IMAGEN EN PREPARACIÓN</small>
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
      className={className}
    />
  );
}
