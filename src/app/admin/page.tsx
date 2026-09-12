import Link from "next/link";
import { formatCop } from "@/data/products";
import { getAdminOrders, getAdminStats } from "@/lib/store-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);
  const recentOrders = orders.slice(0, 5);

  return (
    <section className="admin-section admin-dashboard-final">
      <header className="admin-heading">
        <div><span>GIRTZ WEAR / OPERACIÓN</span><h1>RESUMEN DE VENTAS</h1><p>Ventas, costos, gastos, utilidad e inventario en un solo lugar.</p></div>
        <Link href="/admin/products" className="admin-primary-action">SUBIR PRODUCTO</Link>
      </header>

      <div className="admin-dashboard-shortcuts">
        <Link href="/admin/sales"><span>01</span><strong>REGISTRAR VENTA</strong></Link>
        <Link href="/admin/inventory"><span>02</span><strong>REGISTRAR COMPRA</strong></Link>
        <Link href="/admin/providers"><span>03</span><strong>VER PROVEEDORES</strong></Link>
      </div>

      <div className="admin-metric-grid admin-profit-grid">
        <article><span>VENTAS</span><strong>{formatCop(stats.revenue)}</strong></article>
        <article><span>COSTO VENDIDO</span><strong>{formatCop(stats.cost)}</strong></article>
        <article><span>UTILIDAD BRUTA</span><strong>{formatCop(stats.grossProfit)}</strong></article>
        <article><span>GASTOS</span><strong>{formatCop(stats.expenses)}</strong></article>
        <article className="metric-highlight"><span>UTILIDAD NETA</span><strong>{formatCop(stats.netProfit)}</strong></article>
        <article><span>UNIDADES VENDIDAS</span><strong>{stats.unitsSold}</strong></article>
        <article><span>STOCK REGISTRADO</span><strong>{stats.inventoryUnits}</strong></article>
        <article><span>INVENTARIO AL COSTO</span><strong>{formatCop(stats.inventoryValue)}</strong></article>
      </div>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>ESTADO DEL NEGOCIO</span><h2>CONTROL OPERATIVO</h2></div></div>
        <div className="admin-operation-grid">
          <Link href="/admin/products"><span>PRODUCTOS</span><strong>{stats.products}</strong><small>Subir fotos y editar catálogo</small></Link>
          <Link href="/admin/providers"><span>PROVEEDORES</span><strong>→</strong><small>Compras, costos y última actividad</small></Link>
          <Link href="/admin/customers"><span>CLIENTES</span><strong>{stats.customers}</strong><small>Cuentas registradas</small></Link>
          <Link href="/admin/orders"><span>PEDIDOS WEB</span><strong>{stats.orders}</strong><small>Historial asociado a cuentas</small></Link>
        </div>
      </section>

      {recentOrders.length ? (
        <section className="admin-panel-block">
          <div className="admin-block-heading"><div><span>ACTIVIDAD WEB</span><h2>PEDIDOS RECIENTES</h2></div><Link href="/admin/orders">VER TODOS</Link></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>FECHA</th><th>TOTAL</th><th>ESTADO</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id}><td>#{order.id.slice(0, 8).toUpperCase()}</td><td>{order.customerName || "Sin cliente"}</td><td>{formatDate(order.createdAt)}</td><td>{formatCop(order.total)}</td><td><span className="status-pill">{order.orderStatus}</span></td></tr>)}</tbody></table></div>
        </section>
      ) : null}
    </section>
  );
}
