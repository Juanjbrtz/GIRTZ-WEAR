"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCop } from "@/data/products";

export function CheckoutPanel({
  defaults,
}: {
  defaults: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}) {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        orderId?: string;
        error?: string;
      };

      if (!response.ok || !result.ok || !result.orderId) {
        setError(result.error || "No pudimos crear el pedido. Intenta nuevamente.");
        return;
      }

      clearCart();
      router.push(`/order/${result.orderId}`);
      router.refresh();
    } catch {
      setError("No pudimos conectar con la tienda. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="cart-loading">PREPARANDO CHECKOUT…</div>;
  }

  if (!items.length) {
    return (
      <section className="cart-empty">
        <span className="eyebrow">CHECKOUT</span>
        <h1>NO HAY PRODUCTOS.</h1>
        <p>Agrega una referencia al carrito antes de continuar.</p>
        <Link href="/shop" className="primary-button">VER CATÁLOGO</Link>
      </section>
    );
  }

  return (
    <section className="checkout-shell">
      <div className="checkout-heading">
        <span className="eyebrow">FINALIZAR PEDIDO</span>
        <h1>DATOS DE ENTREGA.</h1>
        <p>
          El pedido quedará registrado en tu cuenta. El pago, la talla y el valor del envío se confirman antes del despacho.
        </p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            <span>NOMBRE COMPLETO</span>
            <input name="name" defaultValue={defaults.name} required autoComplete="name" />
          </label>
          <label>
            <span>CORREO</span>
            <input name="email" type="email" defaultValue={defaults.email} required autoComplete="email" />
          </label>
          <label>
            <span>TELÉFONO</span>
            <input name="phone" defaultValue={defaults.phone} required autoComplete="tel" />
          </label>
          <label className="checkout-wide">
            <span>DIRECCIÓN</span>
            <input name="address" defaultValue={defaults.address} required autoComplete="street-address" />
          </label>
          <label>
            <span>CIUDAD / MUNICIPIO</span>
            <input name="city" defaultValue={defaults.city} required autoComplete="address-level2" />
          </label>

          {error ? <div className="checkout-error">{error}</div> : null}

          <button className="primary-button checkout-submit" type="submit" disabled={submitting}>
            {submitting ? "CREANDO PEDIDO…" : "CONFIRMAR PEDIDO"}
          </button>
        </form>

        <aside className="checkout-summary">
          <span className="eyebrow">TU PEDIDO</span>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}`} className="checkout-item">
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.quantity} × {item.size || "POR CONFIRMAR"}
                  </small>
                </div>
                <span>{formatCop(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="cart-summary-row">
            <span>SUBTOTAL</span>
            <strong>{formatCop(subtotal)}</strong>
          </div>
          <div className="cart-summary-row muted">
            <span>ENVÍO</span>
            <strong>POR CONFIRMAR</strong>
          </div>
          <div className="cart-summary-total">
            <span>TOTAL PRODUCTOS</span>
            <strong>{formatCop(subtotal)}</strong>
          </div>
          <Link href="/cart" className="secondary-button">VOLVER AL CARRITO</Link>
        </aside>
      </div>
    </section>
  );
}
