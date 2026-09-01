"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/data/products";

export function AddToCartButton({
  product,
  buyNow = false,
  className = "primary-button",
}: {
  product: Product;
  buyNow?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      slug: product.slug,
      name: product.name,
      audience: product.audience,
      price: product.price,
      size: "POR CONFIRMAR",
      catalogReference: product.catalogReference,
    });

    if (buyNow) {
      router.push("/checkout");
      return;
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {buyNow ? "COMPRAR AHORA" : added ? "AGREGADO" : "AGREGAR AL CARRITO"}
    </button>
  );
}
