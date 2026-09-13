"use client";

import { useCart } from "@/components/cart-provider";

export function CartOpenButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openCart } = useCart();

  return (
    <button type="button" className={className} onClick={openCart}>
      {children}
    </button>
  );
}
