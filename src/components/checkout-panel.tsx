"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCop } from "@/data/products";

export function CheckoutPanel() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!items.length) return;

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
          department: form.get("department"),
          notes: form.get("notes"),
          items: items.map((item) => ({
            slug: item.slug,
            variantId: item.variantId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        orderId?: string;
        accessToken?: string;
        paymentConfigured?: boolean;
        paymentUrl?: string | null;
        error?: string;
      };

      if (!response.ok || !result.ok || !result.orderId || !result.accessToken) {
        setError(result.error || "No pudimos crear el pedido.");
        return;
      }

      clearCart();

      if (result.paymentConfigured && result.paymentUrl) {
        window.location.assign(result.paymentUrl);
        return;
      }

      router.push(`/order/${result.orderId}?key=${encodeURIComponent(result.accessToken)}`);
      router.refresh();
    } catch {
      setError("No pudimos conectar con la tienda. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="cart-loading">PREPARANDO CHECKOUT…</div>;

  if (!items.length) {
    return (
      <section className="cart-empty">
        <span className="eyebrow">CHECKOUT</span>
        <h1>TU CARRITO ESTÁ VACÍO.</h1>
        <Link href="/shop" className="primary-button">VER CATÁLOGO</Link>
      </section>
    );
  }

  return (
    <section className="checkout-shell commerce-checkout">
      <div className="checkout-heading">
        <span className="eyebrow">FINALIZAR COMPRA</span>
        <h1>DATOS DE ENTREGA.</h1>
        <p>Verificaremos nuevamente precio, talla y stock antes de crear el pedido.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label><span>NOMBRE COMPLETO</span><input name="name" required autoComplete="name" /></label>
          <label><span>CORREO</span><input name="email" type="email" required autoComplete="email" /></label>
          <label><span>TELÉFONO</span><input name="phone" required autoComplete="tel" /></label>
          <label><span>DEPARTAMENTO</span><input name="department" required autoComplete="address-level1" /></label>
          <label><span>CIUDAD / MUNICIPIO</span><input name="city" required autoComplete="address-level2" /></label>
          <label className="checkout-wide"><span>DIRECCIÓN</span><input name="address" required autoComplete="street-address" /></label>
          <label className="checkout-wide"><span>NOTAS <small>Opcional</small></span><input name="notes" placeholder="Apartamento, indicaciones de entrega, etc." /></label>

          {error ? <div className="checkout-error">{error}</div> : null}

          <button className="primary-button checkout-submit" type="submit" disabled={submitting}>
            {submitting ? "VALIDANDO PEDIDO…" : "CONTINUAR AL PAGO"}
          </button>
          <small className="checkout-payment-note">
            Si la pasarela todavía no está configurada, el pedido quedará creado como pendiente de pago.
          </small>
        </form>

        <aside className="checkout-summary">
          <span className="eyebrow">TU PEDIDO</span>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={`${item.variantId}-${item.size}`} className="checkout-item">
                <div>
                  <strong>{item.name}</strong>
                  <small>Talla {item.size} · {item.quantity} und.</small>
                </div>
                <span>{formatCop(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="cart-summary-row"><span>SUBTOTAL</span><strong>{formatCop(subtotal)}</strong></div>
          <div className="cart-summary-row muted"><span>ENVÍO</span><strong>POR CALCULAR</strong></div>
          <div className="cart-summary-total"><span>TOTAL PRODUCTOS</span><strong>{formatCop(subtotal)}</strong></div>
          <Link href="/cart" className="secondary-button">VOLVER AL CARRITO</Link>
        </aside>
      </div>
    </section>
  );
}
