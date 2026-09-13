"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";

export function CartAutoOpen() {
  const { openCart } = useCart();

  useEffect(() => {
    openCart();
  }, [openCart]);

  return null;
}
