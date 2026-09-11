import { registerManualSale, registerProductExpense } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getAdminProducts, getSalesDashboard } from "@/lib/store-data";

type SalesPageProps = {
  searchParams: Promise<{ created?: string; expense?: string; product?: string }>;
};

const eurSizes = ["35", "35.5", "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", "44", "44.5", "45"];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const [{ created, expense, product: selectedProduct }, data, catalog] = await Promise.all([
    searchParams,
    getSalesDashboard(),
    getAdminProducts(),
  ]);

  return (
    <section className="admin-section sales-app">
      <header className="admin-heading">
        <div>
          <span>RESULTADOS</span>
          <h1>VENTAS Y UTILIDAD</h1>
        </div>
      </header>

      {created === "1" ? <div className="admin-success">Venta registrada, inventario actualizado y rentabilidad recalculada.</div> : null}
      {expense === "1" ? <div className="admin-success">Gasto registrado y utilidad neta actualizada.</div> : null}

      <div className="inventory-kpis sales-kpis">
        <article><span>VENTAS</span><strong>{formatCop(data.revenue)}</strong></article>
        <article><span>COSTO VENDIDO</span><strong>{formatCop(data.cost)}</strong></article>
        <article><span>UTILIDAD BRUTA</span><strong>{formatCop(data.grossProfit)}</strong></article>
        <article><span>GASTOS</span><strong>{formatCop(data.totalExpenses)}</strong></article>
        <article><span>UTILIDAD NETA</span><strong>{formatCop(data.netProfit)}</strong></article>
        <article><span>UNIDADES</span><strong>{data.units}</strong></article>
      </div>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading">
          <div>
            <span>VENTA FUERA DE LA WEB</span>
            <h2>REGISTRAR VENTA</h2>
          </div>
        </div>

        <form action={registerManualSale} className="admin-form inventory-entry-form">
          <label>
            <span>PRODUCTO</span>
            <select name="productId" required defaultValue={selectedProduct || ""}>
              <option value="" disabled>Seleccionar referencia</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · stock {item.stockQuantity}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-form-grid three">
            <label>
              <span>TALLA EUR</span>
              <input name="size" list="eur-sale-size-options" inputMode="decimal" placeholder="40" required />
              <datalist id="eur-sale-size-options">
                {eurSizes.map((size) => <option key={size} value={size} />)}
              </datalist>
            </label>
            <label>
              <span>CANTIDAD</span>
              <input name="quantity" type="number" min="1" defaultValue="1" required />
            </label>
            <label>
              <span>PRECIO UNITARIO</span>
              <input name="unitPrice" type="number" min="0" step="100" placeholder="Usar precio publicado" />
            </label>
          </div>

          <div className="admin-form-grid two">
            <label>
              <span>GASTOS DE ESTA VENTA</span>
              <input name="saleExpense" type="number" min="0" step="100" placeholder="Comisión, envío, empaque..." />
            </label>
            <label>
              <span>NOTA</span>
              <input name="note" placeholder="Venta local, transferencia, efectivo, etc." />
            </label>
          </div>

          <button className="admin-primary-action" type="submit">REGISTRAR VENTA</button>
        </form>
      </section>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading">
          <div>
            <span>CONTROL DE GASTOS</span>
            <h2>REGISTRAR GASTO DE UN PRODUCTO</h2>
          </div>
        </div>

        <form action={registerProductExpense} className="admin-form inventory-entry-form">
          <label>
            <span>PRODUCTO</span>
            <select name="productId" required defaultValue={selectedProduct || ""}>
              <option value="" disabled>Seleccionar referencia</option>
              {catalog.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>

          <div className="admin-form-grid two">
            <label>
              <span>TIPO DE GASTO</span>
              <select name="category" defaultValue="Otro" required>
                <option>Transporte proveedor</option>
                <option>Empaque</option>
                <option>Envío cliente</option>
                <option>Comisión de pago</option>
                <option>Publicidad</option>
                <option>Otro</option>
              </select>
            </label>
            <label>
              <span>VALOR</span>
              <input name="amount" type="number" min="1" step="100" placeholder="10000" required />
            </label>
          </div>

          <label>
            <span>DETALLE</span>
            <input name="note" placeholder="Ej. pauta del modelo, bolsa, mensajería..." />
          </label>

          <button className="admin-primary-action" type="submit">REGISTRAR GASTO</button>
        </form>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>RENTABILIDAD REAL</span>
            <h2>POR PRODUCTO</h2>
          </div>
        </div>

        {data.products.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table profitability-table">
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>UNIDADES</th>
                  <th>VENTAS</th>
                  <th>COSTO</th>
                  <th>GASTOS VENTA</th>
                  <th>OTROS GASTOS</th>
                  <th>UTILIDAD BRUTA</th>
                  <th>UTILIDAD NETA</th>
                  <th>MARGEN NETO</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((item) => {
                  const margin = item.revenue > 0 ? Math.round((item.netProfit / item.revenue) * 100) : 0;
                  return (
                    <tr key={`${item.productId || "deleted"}-${item.productName}`}>
                      <td>{item.productName}</td>
                      <td>{item.units}</td>
                      <td>{formatCop(item.revenue)}</td>
                      <td>{formatCop(item.cost)}</td>
                      <td>{formatCop(item.saleExpenses)}</td>
                      <td>{formatCop(item.otherExpenses)}</td>
                      <td>{formatCop(item.grossProfit)}</td>
                      <td><strong>{formatCop(item.netProfit)}</strong></td>
                      <td>{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <div className="admin-empty">Aún no hay ventas ni gastos registrados.</div>}
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>HISTORIAL</span>
            <h2>ÚLTIMAS VENTAS</h2>
          </div>
        </div>

        <div className="inventory-movement-list sales-movement-list">
          {data.movements.length ? data.movements.map((movement) => {
            const revenue = movement.unitPrice * movement.quantity;
            const cost = movement.unitCost * movement.quantity;
            const expenseAmount = movement.expenseAmount || 0;
            const netProfit = movement.movementType === "return" ? -(revenue - cost) : revenue - cost - expenseAmount;
            return (
              <article key={movement.id}>
                <div>
                  <span>{movement.movementType === "return" ? "DEVOLUCIÓN" : "VENTA"}</span>
                  <strong>{movement.productName}</strong>
                  <small>Talla EUR {movement.size || "—"} · {movement.quantity} und. · {formatDate(movement.createdAt)}</small>
                </div>
                <div>
                  <strong>Ingreso {formatCop(revenue)}</strong>
                  <small>Costo {formatCop(cost)} · Gastos {formatCop(expenseAmount)} · Neto {formatCop(netProfit)}</small>
                </div>
              </article>
            );
          }) : <div className="admin-empty">Aún no hay ventas registradas.</div>}
        </div>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>GASTOS</span>
            <h2>ÚLTIMOS GASTOS POR PRODUCTO</h2>
          </div>
        </div>

        <div className="inventory-movement-list">
          {data.expenses.length ? data.expenses.map((item) => (
            <article key={item.id}>
              <div>
                <span>{item.category.toUpperCase()}</span>
                <strong>{item.productName}</strong>
                <small>{item.note || "Sin detalle"} · {formatDate(item.createdAt)}</small>
              </div>
              <div><strong>{formatCop(item.amount)}</strong></div>
            </article>
          )) : <div className="admin-empty">Aún no hay gastos adicionales registrados.</div>}
        </div>
      </section>
    </section>
  );
}
