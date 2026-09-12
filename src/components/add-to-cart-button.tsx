"use client";

import { useCart } from "@/components/cart-provider";
import type { Product } from "@/data/products";

export function AddToCartButton({
  product,
  className = "primary-button",
}: {
  product: Product;
  className?: string;
}) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.slug === product.slug);
  const quantity = cartItem?.quantity || 0;

  function handleAdd() {
    if (quantity > 0) return;
    addItem({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      audience: product.audience,
      price: product.price,
    });
  }

  if (quantity > 0) {
    return (
      <div className="add-to-cart-confirmed" aria-live="polite">
        <div className={`${className} add-to-cart-added`} aria-label={`${product.name} agregado al carrito`}>
          <span className="add-to-cart-check" aria-hidden="true">✓</span>
          AGREGADO
        </div>
        <div className="inline-quantity-control" aria-label={`Cantidad de ${product.name} en el carrito`}>
          <button
            type="button"
            onClick={() => updateQuantity(product.slug, quantity - 1)}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <strong>{quantity}</strong>
          <button
            type="button"
            onClick={() => updateQuantity(product.slug, quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className={className} onClick={handleAdd}>
      AGREGAR AL CARRITO
    </button>
  );
}
