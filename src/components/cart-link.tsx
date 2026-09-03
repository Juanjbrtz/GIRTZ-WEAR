"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink({ compact = false }: { compact?: boolean }) {
  const { count, hydrated } = useCart();
  const visibleCount = hydrated ? count : 0;

  return (
    <Link href="/cart" className={compact ? "cart-link-compact" : "cart-link"}>
      <span>CARRITO</span>
      <strong>{String(visibleCount).padStart(2, "0")}</strong>
    </Link>
  );
}
