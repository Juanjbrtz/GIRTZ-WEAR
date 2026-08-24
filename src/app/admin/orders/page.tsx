import { updateOrderStatus } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getAdminOrders } from "@/lib/store-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminOrdersPage() {
  const orderList = await getAdminOrders();

  return (
    <section className="admin-section">
      <header className="admin-heading">
        <div>
          <span>OPERACIÓN / SEGUIMIENTO</span>
          <h1>PEDIDOS</h1>
        </div>
        <div className="admin-count">{orderList.length} PEDIDOS</div>
      </header>

      {orderList.length ? (
        <div className="admin-order-list">
          {orderList.map((order) => (
            <article key={order.id} className="admin-order-card">
              <header>
                <div>
                  <span>PEDIDO #{order.id.slice(0, 8).toUpperCase()}</span>
                  <strong>{order.customerName || "Cliente sin perfil"}</strong>
                  <small>{order.customerEmail || "Sin correo"} · {formatDate(order.createdAt)}</small>
                </div>
                <div className="admin-order-total">
                  <strong>{formatCop(order.total)}</strong>
                  <span>COSTO {formatCop(order.totalCost)}</span>
                </div>
              </header>

              <form action={updateOrderStatus} className="order-status-form">
                <input type="hidden" name="orderId" value={order.id} />

                <label>
                  <span>PAGO</span>
                  <select name="paymentStatus" defaultValue={order.paymentStatus}>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="failed">Fallido</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </label>

                <label>
                  <span>PEDIDO</span>
                  <select name="orderStatus" defaultValue={order.orderStatus}>
                    <option value="received">Recibido</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="processing">En proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </label>

                <label>
                  <span>ENVÍO</span>
                  <select name="shippingStatus" defaultValue={order.shippingStatus}>
                    <option value="pending">Pendiente</option>
                    <option value="preparing">Preparando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="returned">Devuelto</option>
                  </select>
                </label>

                <label>
                  <span>GUÍA</span>
                  <input
                    name="trackingNumber"
                    type="text"
                    defaultValue={order.trackingNumber || ""}
                    placeholder="Número de seguimiento"
                  />
                </label>

                <button className="admin-primary-action" type="submit">
                  GUARDAR ESTADO
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty">Aún no hay pedidos registrados.</div>
      )}
    </section>
  );
}
