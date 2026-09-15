"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/data/products";
import { getProductSizeOptions } from "@/lib/sizes";

export function AddToCartButton({
  product,
  className = "primary-button",
  showSizeSelector = false,
}: {
  product: Product;
  className?: string;
  showSizeSelector?: boolean;
}) {
  const { items, addItem, updateQuantity, updateSize } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const cartItem = items.find((item) => item.slug === product.slug);
  const quantity = cartItem?.quantity || 0;
  const sizeOptions = getProductSizeOptions(product.sizes);
  const currentSize = cartItem?.size || selectedSize;
  const flowClassName = `add-to-cart-flow${showSizeSelector ? " with-size-picker" : ""}`;

  function handleSizeChange(size: string) {
    setSizeError(false);
    if (cartItem) {
      updateSize(product.slug, size);
    } else {
      setSelectedSize(size);
    }
  }

  function handleAdd() {
    if (quantity > 0) return;
    if (showSizeSelector && !selectedSize) {
      setSizeError(true);
      return;
    }

    addItem({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      audience: product.audience,
      price: product.price,
      size: selectedSize || undefined,
      availableSizes: sizeOptions,
      image: product.image,
      imageAlt: product.imageAlt,
    });
  }

  const sizePicker = showSizeSelector ? (
    <div className="product-size-picker">
      <div className="product-size-picker-head">
        <span>ELIGE TU TALLA EUR</span>
        <small>{currentSize ? `Seleccionada: ${currentSize}` : "Selecciona una talla disponible"}</small>
      </div>
      <div className="product-size-options" role="group" aria-label={`Talla EUR para ${product.name}`}>
        {sizeOptions.map((size) => (
          <button
            key={size}
            type="button"
            className={currentSize === size ? "active" : undefined}
            onClick={() => handleSizeChange(size)}
            aria-pressed={currentSize === size}
          >
            {size}
          </button>
        ))}
      </div>
      {sizeError ? <p className="product-size-error" role="alert">Selecciona tu talla EUR antes de agregar al carrito.</p> : null}
      <p className="product-size-note">La disponibilidad final de la talla se confirma por WhatsApp.</p>
    </div>
  ) : null;

  if (quantity > 0) {
    return (
      <div className={flowClassName}>
        {sizePicker}
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
      </div>
    );
  }

  return (
    <div className={flowClassName}>
      {sizePicker}
      <button type="button" className={className} onClick={handleAdd}>
        AGREGAR AL CARRITO
      </button>
    </div>
  );
}
