"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";
import { WhatsappConsultButton } from "@/components/whatsapp-consult-button";
import { formatCop } from "@/data/products";
import { getProductSizeOptions } from "@/lib/sizes";

export function CartDrawer({ whatsappNumber }: { whatsappNumber: string }) {
  const {
    items,
    count,
    subtotal,
    hydrated,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateSize,
    clearCart,
  } = useCart();

  const missingSize = items.some((item) => !item.size);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-backdrop" role="presentation" onMouseDown={closeCart}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="cart-drawer-header">
          <div>
            <span>MI SELECCIÓN</span>
            <h2>Tu carrito</h2>
          </div>
          <button type="button" className="cart-drawer-close" onClick={closeCart} aria-label="Cerrar carrito">×</button>
        </header>

        {!hydrated ? (
          <div className="cart-drawer-empty"><p>Cargando carrito…</p></div>
        ) : items.length ? (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => {
                const imageSrc = item.image || `/api/cart-product-image/${encodeURIComponent(item.slug)}`;
                const sizeOptions = getProductSizeOptions(item.availableSizes);

                return (
                  <article className={`cart-drawer-item${item.size ? "" : " needs-size"}`} key={item.slug}>
                    <div className="cart-drawer-thumb">
                      <Image
                        src={imageSrc}
                        alt={item.imageAlt || item.name}
                        fill
                        sizes="88px"
                        unoptimized
                      />
                    </div>

                    <div className="cart-drawer-item-copy">
                      <span>{item.brand}</span>
                      <h3>{item.name}</h3>
                      <strong>{formatCop(item.price)}</strong>
                      <label className="cart-size-control">
                        <span>TALLA EUR</span>
                        <select
                          value={item.size || ""}
                          onChange={(event) => updateSize(item.slug, event.target.value)}
                          aria-label={`Talla EUR para ${item.name}`}
                        >
                          <option value="">Seleccionar</option>
                          {sizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
                        </select>
                      </label>
                      <small className={item.size ? "cart-size-ok" : "cart-size-warning"}>
                        {item.size ? `Talla solicitada: EUR ${item.size}` : "Selecciona una talla antes de confirmar."}
                      </small>
                    </div>

                    <div className="cart-drawer-item-actions">
                      <div className="cart-drawer-quantity" aria-label={`Cantidad de ${item.name}`}>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} aria-label="Disminuir cantidad">−</button>
                        <b>{item.quantity}</b>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                      </div>
                      <button type="button" className="cart-drawer-remove" onClick={() => removeItem(item.slug)}>Eliminar</button>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="cart-drawer-summary">
              <div className="cart-drawer-summary-line"><span>Unidades</span><strong>{count}</strong></div>
              <div className="cart-drawer-summary-line total"><span>Subtotal</span><strong>{formatCop(subtotal)}</strong></div>
              <p>{missingSize ? "Selecciona la talla EUR de cada modelo para continuar." : "Confirmaremos disponibilidad y envío por WhatsApp antes de cerrar la compra."}</p>
              <Link href="/guia-tallas" className="cart-mobile-size-guide" onClick={closeCart}>
                GUÍA DE TALLAS <span aria-hidden="true">↗</span>
              </Link>
              <WhatsappConsultButton
                whatsappNumber={whatsappNumber}
                className="cart-drawer-whatsapp"
                label={missingSize ? "SELECCIONA LAS TALLAS" : "CONFIRMAR POR WHATSAPP"}
                requireSizes
              />
              <div className="cart-drawer-secondary-actions">
                <button type="button" onClick={closeCart}>SEGUIR COMPRANDO</button>
                <button type="button" onClick={clearCart}>VACIAR</button>
              </div>
            </footer>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <span>MI SELECCIÓN</span>
            <h3>Tu carrito está vacío.</h3>
            <p>Agrega uno o varios modelos y vuelve aquí para confirmar disponibilidad.</p>
            <Link href="/guia-tallas" className="cart-mobile-size-guide" onClick={closeCart}>
              GUÍA DE TALLAS <span aria-hidden="true">↗</span>
            </Link>
            <button type="button" onClick={closeCart}>VOLVER AL CATÁLOGO</button>
          </div>
        )}
      </aside>
    </div>
  );
}
