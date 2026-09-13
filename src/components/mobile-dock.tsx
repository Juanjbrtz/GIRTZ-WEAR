"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

function IconHome() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 10.5 12 4l7.5 6.5v8.5h-5v-5h-5v5h-5v-8.5Z" /></svg>;
}

function IconGrid() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
}

function IconBag() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 8.2h10.4l.8 11H6l.8-11Z"/><path d="M9 8.2V6.5a3 3 0 0 1 6 0v1.7"/></svg>;
}

function IconUser() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 19c.8-3.6 3-5.4 6.5-5.4s5.7 1.8 6.5 5.4"/></svg>;
}

export function MobileDock() {
  const { count, hydrated, openCart } = useCart();
  const visibleCount = hydrated ? count : 0;

  return (
    <nav className="girtz-mobile-dock" aria-label="Navegación móvil">
      <Link href="/" aria-label="Inicio"><IconHome/><span>Inicio</span></Link>
      <Link href="/shop" aria-label="Catálogo"><IconGrid/><span>Catálogo</span></Link>
      <button type="button" aria-label={`Carrito, ${visibleCount} productos`} className="dock-cart" onClick={openCart}>
        <IconBag/>
        {visibleCount > 0 ? <b>{visibleCount}</b> : null}
        <span>Carrito</span>
      </button>
      <Link href="/account" aria-label="Cuenta"><IconUser/><span>Cuenta</span></Link>
    </nav>
  );
}
