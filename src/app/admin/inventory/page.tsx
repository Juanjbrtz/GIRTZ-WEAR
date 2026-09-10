import { registerInventoryPurchase } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getInventoryDashboard } from "@/lib/store-data";

type InventoryPageProps = {
  searchParams: Promise<{ added?: string; product?: string }>;
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const [{ added, product: selectedProduct }, data] = await Promise.all([
    searchParams,
    getInventoryDashboard(),
  ]);

  const totalUnits = data.products.reduce((sum, product) => sum + product.stockQuantity, 0);
  const inventoryValue = data.products.reduce(
    (sum, product) => sum + product.stockQuantity * Math.max(0, product.cost || 0),
    0,
  );

  return (
    <section className="admin-section inventory-app">
      <header className="admin-heading">
        <div>
          <span>CONTROL DE MERCANCÍA</span>
          <h1>INVENTARIO</h1>
        </div>
      </header>

      {added === "1" ? (
        <div className="admin-success">Entrada registrada y stock actualizado.</div>
      ) : null}

      <div className="inventory-kpis">
        <article><span>UNIDADES</span><strong>{totalUnits}</strong></article>
        <article><span>REFERENCIAS</span><strong>{data.products.length}</strong></article>
        <article><span>VALOR AL COSTO</span><strong>{formatCop(inventoryValue)}</strong></article>
      </div>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading">
          <div>
            <span>NUEVA ENTRADA</span>
            <h2>COMPRA AL PROVEEDOR</h2>
          </div>
        </div>

        <form action={registerInventoryPurchase} className="admin-form inventory-entry-form">
          <label>
            <span>PRODUCTO</span>
            <select name="productId" required defaultValue={selectedProduct || ""}>
              <option value="" disabled>Seleccionar referencia</option>
              {data.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} · {formatCop(product.price)}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-form-grid three">
            <label>
              <span>TALLA</span>
              <input name="size" placeholder="40" required />
            </label>
            <label>
              <span>CANTIDAD</span>
              <input name="quantity" type="number" min="1" defaultValue="1" required />
            </label>
            <label>
              <span>COSTO UNITARIO</span>
              <input name="unitCost" type="number" min="0" step="100" placeholder="150000" />
            </label>
          </div>

          <div className="admin-form-grid two">
            <label>
              <span>PROVEEDOR</span>
              <input name="supplier" placeholder="Proveedor" />
            </label>
            <label>
              <span>NOTA</span>
              <input name="note" placeholder="Compra septiembre" />
            </label>
          </div>

          <button className="admin-primary-action" type="submit">REGISTRAR ENTRADA</button>
        </form>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>EXISTENCIAS</span>
            <h2>STOCK POR REFERENCIA</h2>
          </div>
        </div>

        <div className="inventory-product-strip" aria-label="Inventario por producto">
          {data.products.map((product) => (
            <article className="inventory-product-card" key={product.id}>
              <div className="inventory-product-image">
                <img src={`/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`} alt={product.name} />
              </div>
              <span>{product.brand || "GIRTZ"}</span>
              <h3>{product.name}</h3>
              <strong>{product.stockQuantity} unidades</strong>
              <div className="inventory-size-chips">
                {product.variants.length ? product.variants.map((variant) => (
                  <small key={variant.id}>{variant.size}: {Math.max(0, variant.stockQuantity || 0)}</small>
                )) : <small>SIN INVENTARIO</small>}
              </div>
              <a href={`/admin/inventory?product=${product.id}`}>AGREGAR STOCK</a>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading">
          <div>
            <span>HISTORIAL</span>
            <h2>ÚLTIMOS MOVIMIENTOS</h2>
          </div>
        </div>

        <div className="inventory-movement-list">
          {data.movements.length ? data.movements.map((movement) => (
            <article key={movement.id}>
              <div>
                <span>{movement.movementType.toUpperCase()}</span>
                <strong>{movement.productName}</strong>
                <small>Talla {movement.size || "—"} · {movement.quantity} unidad(es)</small>
              </div>
              <div>
                <strong>{movement.unitCost ? formatCop(movement.unitCost) : "—"}</strong>
                <small>{movement.supplier || "Sin proveedor"}</small>
              </div>
            </article>
          )) : <div className="admin-empty">Aún no hay movimientos de inventario.</div>}
        </div>
      </section>
    </section>
  );
}
