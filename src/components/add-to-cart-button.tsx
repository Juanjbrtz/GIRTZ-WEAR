"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/data/products";

export function AddToCartButton({
  product,
  className = "primary-button",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      audience: product.audience,
      price: product.price,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {added ? "AGREGADO AL CARRITO" : "AGREGAR AL CARRITO"}
    </button>
  );
}
