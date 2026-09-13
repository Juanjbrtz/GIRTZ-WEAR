"use client";

import type { ReactNode } from "react";
import { useCart } from "@/components/cart-provider";

export function CartOpenButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openCart } = useCart();

  return (
    <button type="button" className={className} onClick={openCart}>
      {children}
    </button>
  );
}
