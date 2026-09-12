import Link from "next/link";
import { formatCop } from "@/data/products";
import { getSupplierDashboard } from "@/lib/store-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function ProvidersPage() {
  const suppliers = await getSupplierDashboard();
  const totalPurchases = suppliers.reduce((sum, item) => sum + item.purchaseValue, 0);
  const totalUnits = suppliers.reduce((sum, item) => sum + item.units, 0);

  return (
    <section className="admin-section providers-app">
      <header className="admin-heading"><div><span>COMPRAS</span><h1>PROVEEDORES</h1><p>Resumen automático a partir de las compras registradas en inventario.</p></div><Link href="/admin/inventory" className="admin-primary-action">REGISTRAR COMPRA</Link></header>
      <div className="inventory-kpis"><article><span>PROVEEDORES</span><strong>{suppliers.length}</strong></article><article><span>UNIDADES COMPRADAS</span><strong>{totalUnits}</strong></article><article><span>COMPRAS AL COSTO</span><strong>{formatCop(totalPurchases)}</strong></article></div>
      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>DIRECTORIO OPERATIVO</span><h2>PROVEEDORES REGISTRADOS</h2></div></div>
        {suppliers.length ? (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PROVEEDOR</th><th>REFERENCIAS</th><th>UNIDADES</th><th>COMPRAS</th><th>ÚLTIMA COMPRA</th></tr></thead><tbody>{suppliers.map((item) => <tr key={item.supplier || "sin-proveedor"}><td><strong>{item.supplier}</strong></td><td>{item.products}</td><td>{item.units}</td><td>{formatCop(item.purchaseValue)}</td><td>{item.lastPurchase ? formatDate(item.lastPurchase) : "—"}</td></tr>)}</tbody></table></div>
        ) : <div className="admin-empty">Aún no hay proveedores registrados. Agrega el nombre del proveedor al registrar una compra.</div>}
      </section>
    </section>
  );
}
