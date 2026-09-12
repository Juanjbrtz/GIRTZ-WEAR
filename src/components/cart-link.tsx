"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink({ compact = false }: { compact?: boolean }) {
  const { count, hydrated } = useCart();
  const visibleCount = hydrated ? count : 0;

  if (compact) {
    return (
      <Link
        href="/cart"
        className="cart-link-compact cart-link-icon"
        aria-label={`Carrito, ${visibleCount} ${visibleCount === 1 ? "producto" : "productos"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.8 8.2h10.4l.8 11H6l.8-11Z" />
          <path d="M9 8.2V6.5a3 3 0 0 1 6 0v1.7" />
        </svg>
        {visibleCount > 0 ? <strong className="cart-count-badge">{visibleCount}</strong> : null}
      </Link>
    );
  }

  return (
    <Link href="/cart" className="cart-link">
      <span>CARRITO</span>
      <strong>{String(visibleCount).padStart(2, "0")}</strong>
    </Link>
  );
}
