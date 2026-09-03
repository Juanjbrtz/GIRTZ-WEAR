import type { Metadata } from "next";
import Link from "next/link";
import { signOutAccount } from "@/app/auth/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { requireAccount } from "@/lib/session";
import { getOrdersForCustomer } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi cuenta",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
    received: "Recibido",
    confirmed: "Confirmado",
    processing: "En proceso",
    preparing: "En preparación",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return labels[value] || value;
}

export default async function AccountPage() {
  const { session, customer, isAdmin } = await requireAccount();
  const orderHistory = customer ? await getOrdersForCustomer(customer.id) : [];
  const name = session.user.name || customer?.name || "Cliente GIRTZ";

  return (
    <main className="inner-page account-page">
      <SiteHeader />

      <section className="account-shell">
        <header className="account-heading">
          <div>
            <span className="eyebrow">
              {isAdmin ? "GIRTZ WEAR / CUENTA ADMIN" : "GIRTZ WEAR / MI CUENTA"}
            </span>
            <h1>HOLA, {name.split(" ")[0].toUpperCase()}.</h1>
            <p>
              {isAdmin
                ? "Tu cuenta tiene acceso administrativo y también conserva el historial de compras."
                : "Consulta tu historial y sigue el estado de tus compras desde aquí."}
            </p>
          </div>

          <div className="account-heading-actions">
            {isAdmin ? (
              <Link href="/admin" className="primary-button">
                PANEL ADMIN
              </Link>
            ) : null}
            <form action={signOutAccount}>
              <button type="submit" className="secondary-button">
                CERRAR SESIÓN
              </button>
            </form>
          </div>
        </header>

        <div className="account-summary-grid">
          <article>
            <span>PEDIDOS</span>
            <strong>{orderHistory.length.toString().padStart(2, "0")}</strong>
          </article>
          <article>
            <span>CORREO</span>
            <strong className="summary-copy">{session.user.email}</strong>
          </article>
          <article>
            <span>PERFIL</span>
            <strong className="summary-copy">{isAdmin ? "ADMIN" : customer ? "ACTIVO" : "PENDIENTE"}</strong>
          </article>
        </div>

        {!customer ? (
          <div className="account-notice">
            La cuenta está autenticada, pero la conexión con la base de datos de pedidos todavía no está disponible.
          </div>
        ) : null}

        <section className="account-orders">
          <div className="account-section-heading">
            <div>
              <span className="eyebrow">HISTORIAL</span>
              <h2>MIS PEDIDOS</h2>
            </div>
            <Link href="/shop">IR AL CATÁLOGO</Link>
          </div>

          {orderHistory.length ? (
            <div className="order-list">
              {orderHistory.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-main">
                    <span>PEDIDO</span>
                    <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
                    <small>{formatDate(order.createdAt)}</small>
                    <Link href={`/order/${order.id}`}>VER DETALLE</Link>
                  </div>
                  <div>
                    <span>TOTAL</span>
                    <strong>{formatCop(order.total)}</strong>
                  </div>
                  <div>
                    <span>PAGO</span>
                    <strong>{statusLabel(order.paymentStatus)}</strong>
                  </div>
                  <div>
                    <span>PEDIDO</span>
                    <strong>{statusLabel(order.orderStatus)}</strong>
                  </div>
                  <div>
                    <span>ENVÍO</span>
                    <strong>{statusLabel(order.shippingStatus)}</strong>
                    {order.trackingNumber ? <small>{order.trackingNumber}</small> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>AÚN NO HAY PEDIDOS</span>
              <h3>TU HISTORIAL EMPIEZA CON TU PRIMER PAR.</h3>
              <Link href="/shop" className="primary-button">
                VER CATÁLOGO
              </Link>
            </div>
          )}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
