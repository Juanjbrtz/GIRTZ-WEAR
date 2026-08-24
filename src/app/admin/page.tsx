import Link from "next/link";
import { formatCop } from "@/data/products";
import { getAdminOrders, getAdminStats } from "@/lib/store-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);
  const recentOrders = orders.slice(0, 6);

  return (
    <section className="admin-section">
      <header className="admin-heading">
        <div>
          <span>GIRTZ WEAR / OPERACIÓN</span>
          <h1>RESUMEN</h1>
        </div>
        <Link href="/admin/products" className="admin-primary-action">
          NUEVO PRODUCTO
        </Link>
      </header>

      <div className="admin-metric-grid five">
        <article>
          <span>VENTAS ACUMULADAS</span>
          <strong>{formatCop(stats.revenue)}</strong>
        </article>
        <article>
          <span>UTILIDAD BRUTA</span>
          <strong>{formatCop(stats.grossProfit)}</strong>
        </article>
        <article>
          <span>PEDIDOS</span>
          <strong>{stats.orders.toString().padStart(2, "0")}</strong>
        </article>
        <article>
          <span>CLIENTES</span>
          <strong>{stats.customers.toString().padStart(2, "0")}</strong>
        </article>
        <article>
          <span>PRODUCTOS</span>
          <strong>{stats.products.toString().padStart(2, "0")}</strong>
        </article>
      </div>

      <div className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>ACTIVIDAD</span>
            <h2>PEDIDOS RECIENTES</h2>
          </div>
          <Link href="/admin/orders">VER TODOS</Link>
        </div>

        {recentOrders.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PEDIDO</th>
                  <th>CLIENTE</th>
                  <th>FECHA</th>
                  <th>TOTAL</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td>{order.customerName || "Sin cliente"}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCop(order.total)}</td>
                    <td><span className="status-pill">{order.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">Aún no hay pedidos registrados.</div>
        )}
      </div>
    </section>
  );
}
