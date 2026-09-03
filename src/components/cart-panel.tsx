"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { WhatsappConsultButton } from "@/components/whatsapp-consult-button";
import { formatCop } from "@/data/products";

export function CartPanel({ whatsappNumber }: { whatsappNumber: string }) {
  const {
    items,
    subtotal,
    hydrated,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (!hydrated) {
    return <div className="cart-loading">CARGANDO CARRITO…</div>;
  }

  if (!items.length) {
    return (
      <section className="cart-empty cart-empty-v3">
        <span className="eyebrow">TU SELECCIÓN</span>
        <h1>GUARDA AQUÍ LOS MODELOS QUE TE INTERESAN.</h1>
        <p>
          Agrega uno o varios pares y luego envía una sola consulta por WhatsApp
          para conocer las tallas disponibles.
        </p>
        <Link href="/shop" className="primary-button">
          EXPLORAR CATÁLOGO
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-shell cart-shell-v3">
      <div className="cart-heading cart-heading-v3">
        <div>
          <span className="eyebrow">TU SELECCIÓN</span>
          <h1>CARRITO DE CONSULTA.</h1>
          <p>{items.length} modelos listos para consultar por WhatsApp.</p>
        </div>
        <button type="button" className="cart-clear" onClick={clearCart}>
          VACIAR CARRITO
        </button>
      </div>

      <div className="cart-layout cart-layout-v3">
        <div className="cart-items cart-items-v3">
          {items.map((item, index) => (
            <article key={item.slug} className="cart-item cart-item-v3">
              <div className="cart-item-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="cart-item-main">
                <div className="cart-item-topline">
                  <span>{item.brand.toUpperCase()}</span>
                  <span>{item.audience.toUpperCase()}</span>
                </div>
                <h2>{item.name}</h2>
                <strong>{formatCop(item.price)} + envío</strong>
                <div className="cart-size-request-v3">
                  TALLAS · CONSULTAR DISPONIBILIDAD
                </div>

                <div className="cart-item-controls">
                  <label>
                    <span>CANTIDAD</span>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        −
                      </button>
                      <b>{item.quantity}</b>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
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
                <button type="button" onClick={() => removeItem(item.slug)}>
                  ELIMINAR
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary cart-summary-v3">
          <span className="eyebrow">CONSULTA</span>
          <h2>CONFIRMA TALLAS POR WHATSAPP.</h2>
          <div className="cart-summary-row">
            <span>UNIDADES</span>
            <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>VALOR PRODUCTOS</span>
            <strong>{formatCop(subtotal)}</strong>
          </div>
          <div className="cart-summary-row muted">
            <span>ENVÍO</span>
            <strong>POR CONFIRMAR</strong>
          </div>

          <WhatsappConsultButton
            whatsappNumber={whatsappNumber}
            className="whatsapp-button whatsapp-button-cart"
            label="CONSULTAR TODO EN WHATSAPP"
          />
          <Link href="/shop" className="secondary-button">
            AGREGAR MÁS MODELOS
          </Link>
          <p>
            WhatsApp recibirá automáticamente los modelos y cantidades de este carrito.
            Allí te confirmamos qué tallas hay disponibles.
          </p>
        </aside>
      </div>
    </section>
  );
}
