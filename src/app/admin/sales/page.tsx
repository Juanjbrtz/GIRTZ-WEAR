import { registerManualSale } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getAdminProducts, getSalesDashboard } from "@/lib/store-data";

type SalesPageProps = {
  searchParams: Promise<{ created?: string; product?: string }>;
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
  const [{ created, product: selectedProduct }, data, catalog] = await Promise.all([
    searchParams,
    getSalesDashboard(),
    getAdminProducts(),
  ]);

  return (
    <section className="admin-section sales-app">
      <header className="admin-heading">
        <div>
          <span>RESULTADOS</span>
          <h1>VENTAS</h1>
        </div>
      </header>

      {created === "1" ? <div className="admin-success">Venta registrada e inventario actualizado.</div> : null}

      <div className="inventory-kpis sales-kpis">
        <article><span>VENTAS</span><strong>{formatCop(data.revenue)}</strong></article>
        <article><span>COSTO VENDIDO</span><strong>{formatCop(data.cost)}</strong></article>
        <article><span>UTILIDAD BRUTA</span><strong>{formatCop(data.profit)}</strong></article>
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

          <label>
            <span>NOTA</span>
            <input name="note" placeholder="Venta local, transferencia, efectivo, etc." />
          </label>

          <button className="admin-primary-action" type="submit">REGISTRAR VENTA</button>
        </form>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>RENTABILIDAD</span>
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
                  <th>UTILIDAD</th>
                  <th>MARGEN</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((item) => {
                  const margin = item.revenue > 0 ? Math.round((item.profit / item.revenue) * 100) : 0;
                  return (
                    <tr key={`${item.productId || "deleted"}-${item.productName}`}>
                      <td>{item.productName}</td>
                      <td>{item.units}</td>
                      <td>{formatCop(item.revenue)}</td>
                      <td>{formatCop(item.cost)}</td>
                      <td><strong>{formatCop(item.profit)}</strong></td>
                      <td>{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <div className="admin-empty">Aún no hay ventas registradas.</div>}
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>HISTORIAL</span>
            <h2>ÚLTIMAS VENTAS</h2>
          </div>
        </div>

        <div className="inventory-movement-list sales-movement-list">
          {data.movements.length ? data.movements.map((movement) => (
            <article key={movement.id}>
              <div>
                <span>{movement.movementType === "return" ? "DEVOLUCIÓN" : "VENTA"}</span>
                <strong>{movement.productName}</strong>
                <small>Talla EUR {movement.size || "—"} · {movement.quantity} und. · {formatDate(movement.createdAt)}</small>
              </div>
              <div>
                <strong>{formatCop(movement.unitPrice * movement.quantity)}</strong>
                <small>Utilidad {formatCop((movement.unitPrice - movement.unitCost) * movement.quantity)}</small>
              </div>
            </article>
          )) : <div className="admin-empty">Aún no hay ventas registradas.</div>}
        </div>
      </section>
    </section>
  );
}
