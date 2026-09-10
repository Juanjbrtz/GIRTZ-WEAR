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
    <section className="admin-section dashboard-v2">
      <header className="admin-heading">
        <div>
          <span>GIRTZ WEAR</span>
          <h1>RESUMEN</h1>
        </div>
        <Link href="/admin/products" className="admin-primary-action">NUEVO PRODUCTO</Link>
      </header>

      <div className="admin-metric-grid commerce-metrics">
        <article><span>VENTAS</span><strong>{formatCop(stats.revenue)}</strong></article>
        <article><span>UTILIDAD BRUTA</span><strong>{formatCop(stats.grossProfit)}</strong></article>
        <article><span>UNIDADES VENDIDAS</span><strong>{stats.unitsSold}</strong></article>
        <article><span>UNIDADES EN STOCK</span><strong>{stats.inventoryUnits}</strong></article>
        <article><span>INVENTARIO AL COSTO</span><strong>{formatCop(stats.inventoryValue)}</strong></article>
        <article><span>PEDIDOS</span><strong>{stats.orders}</strong></article>
      </div>

      <div className="admin-dashboard-shortcuts">
        <Link href="/admin/products"><span>CATÁLOGO</span><strong>Publicar producto →</strong></Link>
        <Link href="/admin/inventory"><span>INVENTARIO</span><strong>Registrar compra →</strong></Link>
        <Link href="/admin/sales"><span>VENTAS</span><strong>Ver utilidad →</strong></Link>
      </div>

      <div className="admin-panel-block">
        <div className="admin-block-heading">
          <div><span>ACTIVIDAD</span><h2>PEDIDOS RECIENTES</h2></div>
          <Link href="/admin/orders">VER TODOS</Link>
        </div>

        {recentOrders.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>PEDIDO</th><th>CLIENTE</th><th>FECHA</th><th>TOTAL</th><th>PAGO</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td>{order.customerName || "Cliente"}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCop(order.total)}</td>
                    <td><span className="status-pill">{order.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="admin-empty">Aún no hay pedidos registrados.</div>}
      </div>
    </section>
  );
}
