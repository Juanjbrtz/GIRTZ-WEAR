import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatCop } from "@/data/products";
import { getSessionAccount } from "@/lib/session";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  received: "Recibido",
  confirmed: "Confirmado",
  processing: "En preparación",
  preparing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  paid: "Pagado",
  failed: "Pago rechazado",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const [{ id }, { key }, account] = await Promise.all([
    params,
    searchParams,
    getSessionAccount(),
  ]);

  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();

  const authorizedByAccount = Boolean(
    account.isAdmin || (account.customer && order.customerId === account.customer.id),
  );
  const authorizedByToken = Boolean(key && order.accessToken && key === order.accessToken);
  if (!authorizedByAccount && !authorizedByToken) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const paymentUrl = order.paymentStatus === "pending" && order.accessToken && order.paymentReference
    ? buildWompiCheckoutUrl({
        orderId: order.id,
        accessToken: order.accessToken,
        reference: order.paymentReference,
        totalCop: order.total,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      })
    : null;

  const deliveryLocation = [order.shippingCity, order.shippingDepartment].filter(Boolean).join(", ");

  return (
    <main className="inner-page order-page">
      <SiteHeader />

      <section className="order-shell">
        <div className="order-confirmation-head">
          <span className="eyebrow">PEDIDO #{order.id.slice(0, 8).toUpperCase()}</span>
          <h1>{order.paymentStatus === "paid" ? "COMPRA CONFIRMADA." : "PEDIDO RECIBIDO."}</h1>
          <p>
            {order.paymentStatus === "paid"
              ? "Tu pago está confirmado. Prepararemos el pedido para despacho."
              : "Tu pedido quedó registrado y está pendiente de pago."}
          </p>
        </div>

        <div className="order-layout">
          <div className="order-detail-card">
            <div className="order-number-row">
              <span>NÚMERO DE PEDIDO</span>
              <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
            </div>

            <div className="order-status-grid">
              <div><span>PAGO</span><strong>{statusLabel[order.paymentStatus] || order.paymentStatus}</strong></div>
              <div><span>PEDIDO</span><strong>{statusLabel[order.orderStatus] || order.orderStatus}</strong></div>
              <div><span>ENVÍO</span><strong>{statusLabel[order.shippingStatus] || order.shippingStatus}</strong></div>
            </div>

            <div className="order-products">
              {items.map((item) => (
                <div key={item.id} className="order-product-row">
                  <div>
                    <strong>{item.productName}</strong>
                    <small>Talla EUR {item.size} · Cantidad {item.quantity}</small>
                  </div>
                  <span>{formatCop(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-products">
              <div className="order-product-row">
                <div>
                  <strong>ENTREGA</strong>
                  <small>
                    {order.customerName || "Cliente"}<br />
                    {order.shippingAddress || "Dirección pendiente"}
                    {deliveryLocation ? <><br />{deliveryLocation}</> : null}
                    {order.customerPhone ? <><br />{order.customerPhone}</> : null}
                  </small>
                </div>
              </div>
            </div>

            <div className="order-total-row">
              <span>TOTAL</span>
              <strong>{formatCop(order.total)}</strong>
            </div>
            <small className="order-shipping-note">
              {order.shippingCost > 0 ? `Envío: ${formatCop(order.shippingCost)}` : "El valor del envío se definirá antes del despacho."}
            </small>
          </div>

          <aside className="order-next-steps">
            <span className="eyebrow">ESTADO DE COMPRA</span>
            {paymentUrl ? (
              <>
                <p>Completa el pago seguro para confirmar la compra.</p>
                <a href={paymentUrl} className="primary-button">PAGAR AHORA</a>
              </>
            ) : order.paymentStatus === "pending" ? (
              <p>El pago online todavía no está habilitado. Tu pedido permanece registrado como pendiente.</p>
            ) : (
              <p>Consulta aquí el avance de tu pedido hasta la entrega.</p>
            )}
            {account.session?.user ? <Link href="/account" className="secondary-button">MIS PEDIDOS</Link> : null}
            <Link href="/shop" className="secondary-button">VOLVER AL CATÁLOGO</Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
