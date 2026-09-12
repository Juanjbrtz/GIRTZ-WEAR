import type { Metadata } from "next";
import Link from "next/link";
import { updateAccountProfile } from "@/app/account/actions";
import { signOutAccount } from "@/app/auth/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { requireAccount } from "@/lib/session";
import { getOrdersForCustomer } from "@/lib/store-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi cuenta" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente", paid: "Pagado", failed: "Fallido", received: "Recibido",
    confirmed: "Confirmado", processing: "En proceso", preparing: "En preparación",
    shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado",
  };
  return labels[value] || value;
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ profile?: string }> }) {
  const [{ profile }, account] = await Promise.all([searchParams, requireAccount()]);
  const { session, customer, isAdmin } = account;
  const orderHistory = customer ? await getOrdersForCustomer(customer.id) : [];
  const name = customer?.name || session.user.name || "Cliente GIRTZ";

  return (
    <main className="inner-page account-page account-page-final">
      <SiteHeader />
      <section className="account-shell">
        <header className="account-heading">
          <div>
            <span className="eyebrow">{isAdmin ? "GIRTZ WEAR / ADMIN" : "GIRTZ WEAR / MI CUENTA"}</span>
            <h1>HOLA, {name.split(" ")[0].toUpperCase()}.</h1>
            <p>Administra tus datos y consulta el historial registrado en GIRTZ Wear.</p>
          </div>
          {isAdmin ? <Link href="/admin" className="primary-button">IR AL PANEL ADMIN</Link> : null}
        </header>

        <nav className="account-quick-nav" aria-label="Secciones de mi cuenta">
          <a href="#pedidos">MIS PEDIDOS</a>
          <a href="#configuracion">MIS DATOS</a>
          <a href="#cerrar-sesion">CERRAR SESIÓN</a>
        </nav>

        <div className="account-summary-grid">
          <article><span>PEDIDOS</span><strong>{orderHistory.length.toString().padStart(2, "0")}</strong></article>
          <article><span>CORREO</span><strong className="summary-copy">{session.user.email}</strong></article>
          <article><span>PERFIL</span><strong className="summary-copy">{isAdmin ? "ADMIN" : "CLIENTE"}</strong></article>
        </div>

        <section className="account-orders" id="pedidos">
          <div className="account-section-heading">
            <div><span className="eyebrow">HISTORIAL</span><h2>MIS PEDIDOS</h2></div>
            <Link href="/shop">IR AL CATÁLOGO</Link>
          </div>
          {orderHistory.length ? (
            <div className="order-list">
              {orderHistory.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-main"><span>PEDIDO</span><strong>#{order.id.slice(0, 8).toUpperCase()}</strong><small>{formatDate(order.createdAt)}</small><Link href={`/order/${order.id}`}>VER DETALLE</Link></div>
                  <div><span>TOTAL</span><strong>{formatCop(order.total)}</strong></div>
                  <div><span>PAGO</span><strong>{statusLabel(order.paymentStatus)}</strong></div>
                  <div><span>PEDIDO</span><strong>{statusLabel(order.orderStatus)}</strong></div>
                  <div><span>ENVÍO</span><strong>{statusLabel(order.shippingStatus)}</strong>{order.trackingNumber ? <small>{order.trackingNumber}</small> : null}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><span>AÚN NO HAY PEDIDOS REGISTRADOS</span><h3>CUANDO UNA COMPRA SE CIERRE Y QUEDE REGISTRADA, PODRÁS VERLA AQUÍ.</h3><Link href="/shop" className="primary-button">VER CATÁLOGO</Link></div>
          )}
        </section>

        <section className="account-settings-card" id="configuracion">
          <div className="account-section-heading">
            <div><span className="eyebrow">CONFIGURACIÓN</span><h2>MIS DATOS</h2></div>
          </div>
          {profile === "1" ? <div className="account-notice success">Datos actualizados correctamente.</div> : null}
          {customer ? (
            <form action={updateAccountProfile} className="account-profile-form">
              <label><span>NOMBRE</span><input name="name" defaultValue={customer.name} required /></label>
              <label><span>CORREO</span><input value={session.user.email || ""} disabled /></label>
              <label><span>CELULAR</span><input name="phone" type="tel" defaultValue={customer.phone || ""} placeholder="300 000 0000" /></label>
              <label><span>CIUDAD</span><input name="city" defaultValue={customer.city || ""} placeholder="Medellín" /></label>
              <label className="wide"><span>DIRECCIÓN</span><input name="address" defaultValue={customer.address || ""} placeholder="Dirección de referencia" /></label>
              <button type="submit" className="primary-button">GUARDAR CAMBIOS</button>
            </form>
          ) : <div className="account-notice">No fue posible cargar la información del perfil.</div>}
        </section>

        <section className="account-signout" id="cerrar-sesion">
          <div><span className="eyebrow">SESIÓN</span><h2>¿TERMINASTE?</h2></div>
          <form action={signOutAccount}><button type="submit" className="secondary-button">CERRAR SESIÓN</button></form>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
