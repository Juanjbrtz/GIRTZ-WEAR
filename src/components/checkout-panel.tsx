import Link from "next/link";

export function CheckoutPanel() {
  return (
    <section className="cart-empty">
      <span className="eyebrow">GIRTZ WEAR</span>
      <h1>LA COMPRA SE COORDINA POR WHATSAPP.</h1>
      <p>
        Usa el carrito para reunir tus modelos y consultar disponibilidad de tallas.
      </p>
      <Link href="/cart" className="primary-button">
        IR AL CARRITO
      </Link>
    </section>
  );
}
