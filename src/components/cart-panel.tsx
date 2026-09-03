"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCop } from "@/data/products";

export function CartPanel() {
  const {
    items,
    subtotal,
    hydrated,
    removeItem,
    updateQuantity,
    updateSize,
    clearCart,
  } = useCart();

  if (!hydrated) {
    return <div className="cart-loading">CARGANDO CARRITO…</div>;
  }

  if (!items.length) {
    return (
      <section className="cart-empty">
        <span className="eyebrow">TU SELECCIÓN</span>
        <h1>EL CARRITO ESTÁ VACÍO.</h1>
        <p>Explora las referencias de Hombre, Mujer y Unisex y agrega las que quieras consultar o comprar.</p>
        <Link href="/shop" className="primary-button">
          VER CATÁLOGO
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-shell">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">TU SELECCIÓN</span>
          <h1>CARRITO.</h1>
        </div>
        <button type="button" className="cart-clear" onClick={clearCart}>
          VACIAR CARRITO
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article key={`${item.slug}-${item.size}`} className="cart-item">
              <div className="cart-item-number">{String(items.indexOf(item) + 1).padStart(2, "0")}</div>
              <div className="cart-item-main">
                <div className="cart-item-topline">
                  <span>{item.audience.toUpperCase()}</span>
                  <span>{item.catalogReference || "GIRTZ WEAR"}</span>
                </div>
                <h2>{item.name}</h2>
                <strong>{formatCop(item.price)} + envío</strong>

                <div className="cart-item-controls">
                  <label>
                    <span>TALLA</span>
                    <input
                      value={item.size === "POR CONFIRMAR" ? "" : item.size}
                      placeholder="Por confirmar"
                      onChange={(event) => updateSize(item.slug, event.target.value)}
                    />
                  </label>

                  <label>
                    <span>CANTIDAD</span>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1, item.size)}
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        −
                      </button>
                      <b>{item.quantity}</b>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1, item.size)}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              <div className="cart-item-side">
                <strong>{formatCop(item.price * item.quantity)}</strong>
                <button type="button" onClick={() => removeItem(item.slug, item.size)}>
                  ELIMINAR
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="eyebrow">RESUMEN</span>
          <div className="cart-summary-row">
            <span>PRODUCTOS</span>
            <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>SUBTOTAL</span>
            <strong>{formatCop(subtotal)}</strong>
          </div>
          <div className="cart-summary-row muted">
            <span>ENVÍO</span>
            <strong>POR CALCULAR</strong>
          </div>
          <div className="cart-summary-total">
            <span>TOTAL PRODUCTOS</span>
            <strong>{formatCop(subtotal)}</strong>
          </div>

          <Link href="/checkout" className="primary-button">
            CONTINUAR COMPRA
          </Link>
          <Link href="/shop" className="secondary-button">
            SEGUIR COMPRANDO
          </Link>
          <p>La talla y el valor final del envío se confirman antes del despacho.</p>
        </aside>
      </div>
    </section>
  );
}
