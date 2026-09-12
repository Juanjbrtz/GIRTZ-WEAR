import { registerExpense, registerManualSale } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getAdminProducts, getSalesDashboard } from "@/lib/store-data";

type SalesPageProps = { searchParams: Promise<{ created?: string; expense?: string; product?: string }> };
const eurSizes = ["35","35.5","36","36.5","37","37.5","38","38.5","39","39.5","40","40.5","41","41.5","42","42.5","43","43.5","44","44.5","45"];
function formatDate(date: Date) { return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date); }

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const [{ created, expense, product: selectedProduct }, data, catalog] = await Promise.all([searchParams, getSalesDashboard(), getAdminProducts()]);

  return (
    <section className="admin-section sales-app">
      <header className="admin-heading"><div><span>RESULTADOS</span><h1>VENTAS Y UTILIDAD</h1><p>Registra las ventas cerradas por WhatsApp y controla el resultado real.</p></div></header>
      {created === "1" ? <div className="admin-success">Venta registrada correctamente.</div> : null}
      {expense === "1" ? <div className="admin-success">Gasto registrado correctamente.</div> : null}

      <div className="inventory-kpis sales-kpis">
        <article><span>VENTAS</span><strong>{formatCop(data.revenue)}</strong></article>
        <article><span>COSTO VENDIDO</span><strong>{formatCop(data.cost)}</strong></article>
        <article><span>UTILIDAD BRUTA</span><strong>{formatCop(data.grossProfit)}</strong></article>
        <article><span>GASTOS</span><strong>{formatCop(data.expenses)}</strong></article>
        <article><span>UTILIDAD NETA</span><strong>{formatCop(data.netProfit)}</strong></article>
        <article><span>UNIDADES</span><strong>{data.units}</strong></article>
      </div>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading"><div><span>VENTA CERRADA</span><h2>REGISTRAR VENTA DE WHATSAPP</h2></div></div>
        <form action={registerManualSale} className="admin-form inventory-entry-form">
          <label><span>PRODUCTO</span><select name="productId" required defaultValue={selectedProduct || ""}><option value="" disabled>Seleccionar referencia</option>{catalog.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="admin-form-grid three">
            <label><span>TALLA EUR</span><input name="size" list="eur-sale-size-options" inputMode="decimal" placeholder="40" required /><datalist id="eur-sale-size-options">{eurSizes.map((size) => <option key={size} value={size} />)}</datalist></label>
            <label><span>CANTIDAD</span><input name="quantity" type="number" min="1" defaultValue="1" required /></label>
            <label><span>PRECIO UNITARIO</span><input name="unitPrice" inputMode="numeric" pattern="[0-9]*" placeholder="Usar precio publicado" /></label>
          </div>
          <div className="admin-form-grid three">
            <label><span>COSTO REAL UNITARIO</span><input name="unitCost" inputMode="numeric" pattern="[0-9]*" placeholder="Usar costo registrado" /></label>
            <label><span>GASTOS DE ESTA VENTA</span><input name="saleExpense" inputMode="numeric" pattern="[0-9]*" placeholder="Envío, empaque..." /></label>
            <label><span>NOTA</span><input name="note" placeholder="Transferencia / cliente / referencia" /></label>
          </div>
          <button className="admin-primary-action" type="submit">REGISTRAR VENTA</button>
        </form>
      </section>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading"><div><span>GASTOS</span><h2>REGISTRAR GASTO</h2></div></div>
        <form action={registerExpense} className="admin-form inventory-entry-form">
          <label><span>PRODUCTO <small>Opcional</small></span><select name="productId" defaultValue=""><option value="">GASTO GENERAL</option>{catalog.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="admin-form-grid three">
            <label><span>TIPO</span><select name="category" defaultValue="Otro"><option>Transporte proveedor</option><option>Empaque</option><option>Envío cliente</option><option>Comisión</option><option>Publicidad</option><option>Otro</option></select></label>
            <label><span>VALOR</span><input name="amount" inputMode="numeric" pattern="[0-9]*" placeholder="10000" required /></label>
            <label><span>DETALLE</span><input name="note" placeholder="Descripción del gasto" /></label>
          </div>
          <button className="admin-primary-action" type="submit">REGISTRAR GASTO</button>
        </form>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>RENTABILIDAD</span><h2>POR PRODUCTO</h2></div></div>
        {data.products.length ? (
          <div className="admin-table-wrap"><table className="admin-table profitability-table"><thead><tr><th>PRODUCTO</th><th>UNIDADES</th><th>VENTAS</th><th>COSTO</th><th>GASTOS</th><th>UTILIDAD NETA</th><th>MARGEN</th></tr></thead><tbody>{data.products.map((item) => { const margin = item.revenue > 0 ? Math.round((item.netProfit / item.revenue) * 100) : 0; return <tr key={`${item.productId || "general"}-${item.productName}`}><td>{item.productName}</td><td>{item.units}</td><td>{formatCop(item.revenue)}</td><td>{formatCop(item.cost)}</td><td>{formatCop(item.expenses)}</td><td><strong>{formatCop(item.netProfit)}</strong></td><td>{margin}%</td></tr>; })}</tbody></table></div>
        ) : <div className="admin-empty">Aún no hay ventas ni gastos registrados.</div>}
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>HISTORIAL</span><h2>ÚLTIMAS VENTAS</h2></div></div>
        <div className="inventory-movement-list sales-movement-list">{data.movements.length ? data.movements.map((movement) => { const revenue = movement.unitPrice * movement.quantity; const cost = movement.unitCost * movement.quantity; return <article key={movement.id}><div><span>{movement.movementType === "return" ? "DEVOLUCIÓN" : "VENTA"}</span><strong>{movement.productName}</strong><small>Talla {movement.size || "—"} · {movement.quantity} und. · {formatDate(movement.createdAt)}</small></div><div><strong>{formatCop(revenue)}</strong><small>Costo {formatCop(cost)} · Bruta {formatCop(revenue - cost)}</small></div></article>; }) : <div className="admin-empty">Aún no hay ventas registradas.</div>}</div>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>HISTORIAL</span><h2>ÚLTIMOS GASTOS</h2></div></div>
        <div className="inventory-movement-list">{data.expenseMovements.length ? data.expenseMovements.map((movement) => <article key={movement.id}><div><span>{(movement.supplier || "GASTO").toUpperCase()}</span><strong>{movement.productName}</strong><small>{movement.note || "Sin detalle"} · {formatDate(movement.createdAt)}</small></div><div><strong>{formatCop(movement.unitCost * Math.abs(movement.quantity))}</strong></div></article>) : <div className="admin-empty">Aún no hay gastos registrados.</div>}</div>
      </section>
    </section>
  );
}
