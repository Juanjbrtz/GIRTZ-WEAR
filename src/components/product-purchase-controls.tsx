"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/data/products";

export function ProductPurchaseControls({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const available = useMemo(
    () => product.variants.filter((variant) => variant.available && variant.stockQuantity > 0),
    [product.variants],
  );
  const [size, setSize] = useState(available[0]?.size || "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const selected = available.find((variant) => variant.size === size);

  function add(goToCheckout = false) {
    if (!selected) return;
    addItem({
      slug: product.slug,
      variantId: selected.id,
      size: selected.size,
      name: product.name,
      brand: product.brand,
      audience: product.audience,
      price: product.price,
      image: product.image,
      maxQuantity: selected.stockQuantity,
    });
    if (goToCheckout) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  if (!available.length) {
    return <div className="out-of-stock-button">AGOTADO</div>;
  }

  return (
    <div className={compact ? "purchase-controls compact" : "purchase-controls"}>
      <label className="purchase-size-select">
        <span>TALLA EUR</span>
        <select value={size} onChange={(event) => setSize(event.target.value)}>
          {available.map((variant) => (
            <option key={variant.id} value={variant.size}>
              {variant.size}
            </option>
          ))}
        </select>
      </label>
      <div className="purchase-actions">
        <button type="button" className="product-cart-button" onClick={() => add(false)}>
          {added ? "AGREGADO" : "AGREGAR AL CARRITO"}
        </button>
        {!compact ? (
          <button type="button" className="primary-button" onClick={() => add(true)}>
            COMPRAR
          </button>
        ) : null}
      </div>
    </div>
  );
}
