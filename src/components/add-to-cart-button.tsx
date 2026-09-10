"use client";

import { ProductPurchaseControls } from "@/components/product-purchase-controls";
import type { Product } from "@/data/products";

/**
 * Compatibility wrapper for older storefront call sites.
 * The commerce flow requires a concrete size/variant before an item can enter
 * the cart, so this component delegates to the size-aware purchase controls.
 */
export function AddToCartButton({
  product,
}: {
  product: Product;
  className?: string;
}) {
  return <ProductPurchaseControls product={product} compact />;
}
