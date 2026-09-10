"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCop } from "@/data/products";

export function CartPanel() {
  const { items, subtotal, hydrated, removeItem, updateQuantity, clearCart } = useCart();

  if (!hydrated) return <div className="cart-loading">CARGANDO CARRITO…</div>;

  if (!items.length) {
    return (
      <section className="cart-empty cart-empty-v3">
        <span className="eyebrow">GIRTZ WEAR</span>
        <h1>TU CARRITO ESTÁ VACÍO.</h1>
        <p>Encuentra tu próximo par y agrégalo al carrito.</p>
        <Link href="/shop" className="primary-button">VER CATÁLOGO</Link>
      </section>
    );
  }

  return (
    <section className="cart-shell cart-shell-v3 commerce-cart">
      <div className="cart-heading cart-heading-v3">
        <div>
          <span className="eyebrow">TU COMPRA</span>
          <h1>CARRITO.</h1>
          <p>{items.reduce((sum, item) => sum + item.quantity, 0)} producto(s)</p>
        </div>
        <button type="button" className="cart-clear" onClick={clearCart}>VACIAR</button>
      </div>

      <div className="cart-layout cart-layout-v3">
        <div className="cart-items cart-items-v3">
          {items.map((item, index) => (
            <article key={`${item.slug}-${item.size}`} className="cart-item cart-item-v3">
              <div className="cart-item-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="cart-item-main">
                <div className="cart-item-topline"><span>{item.brand.toUpperCase()}</span><span>TALLA EUR {item.size}</span></div>
                <h2>{item.name}</h2>
                <strong>{formatCop(item.price)}</strong>
                <div className="cart-item-controls">
                  <label>
                    <span>CANTIDAD</span>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)} aria-label="Reducir cantidad">−</button>
                      <b>{item.quantity}</b>
                      <button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                    </div>
                  </label>
                  <small>Cantidad limitada al stock disponible.</small>
                </div>
              </div>
              <div className="cart-item-side">
                <strong>{formatCop(item.price * item.quantity)}</strong>
                <button type="button" onClick={() => removeItem(item.slug, item.size)}>ELIMINAR</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary cart-summary-v3">
          <span className="eyebrow">RESUMEN</span>
          <div className="cart-summary-row"><span>PRODUCTOS</span><strong>{formatCop(subtotal)}</strong></div>
          <div className="cart-summary-row muted"><span>ENVÍO</span><strong>EN CHECKOUT</strong></div>
          <div className="cart-summary-total"><span>SUBTOTAL</span><strong>{formatCop(subtotal)}</strong></div>
          <Link href="/checkout" className="primary-button">CONTINUAR COMPRA</Link>
          <Link href="/shop" className="secondary-button">SEGUIR COMPRANDO</Link>
        </aside>
      </div>
    </section>
  );
}
