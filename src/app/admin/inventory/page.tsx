import { registerInventoryPurchase } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getInventoryDashboard } from "@/lib/store-data";

type InventoryPageProps = { searchParams: Promise<{ added?: string; product?: string }> };
const eurSizes = ["35","35.5","36","36.5","37","37.5","38","38.5","39","39.5","40","40.5","41","41.5","42","42.5","43","43.5","44","44.5","45"];

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const [{ added, product: selectedProduct }, data] = await Promise.all([searchParams, getInventoryDashboard()]);
  const totalUnits = data.products.reduce((sum, product) => sum + product.stockQuantity, 0);
  const inventoryValue = data.products.reduce((sum, product) => sum + product.inventoryValue, 0);

  return (
    <section className="admin-section inventory-app">
      <header className="admin-heading"><div><span>COMPRAS / COSTOS</span><h1>INVENTARIO</h1><p>Registra compras al proveedor y controla costo por referencia y talla.</p></div></header>
      {added === "1" ? <div className="admin-success">Compra registrada e inventario actualizado.</div> : null}

      <div className="inventory-kpis">
        <article><span>UNIDADES REGISTRADAS</span><strong>{totalUnits}</strong></article>
        <article><span>REFERENCIAS</span><strong>{data.products.length}</strong></article>
        <article><span>VALOR AL COSTO</span><strong>{formatCop(inventoryValue)}</strong></article>
      </div>

      <section className="admin-panel-block inventory-entry-card">
        <div className="admin-block-heading"><div><span>NUEVA COMPRA</span><h2>REGISTRAR PEDIDO AL PROVEEDOR</h2></div></div>
        <form action={registerInventoryPurchase} className="admin-form inventory-entry-form">
          <label><span>PRODUCTO</span><select name="productId" required defaultValue={selectedProduct || ""}><option value="" disabled>Seleccionar referencia</option>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name} · venta {formatCop(product.price)}</option>)}</select></label>
          <div className="admin-form-grid three">
            <label><span>TALLA EUR</span><input name="size" list="eur-size-options" inputMode="decimal" placeholder="40" required /><datalist id="eur-size-options">{eurSizes.map((size) => <option key={size} value={size} />)}</datalist></label>
            <label><span>CANTIDAD</span><input name="quantity" type="number" min="1" defaultValue="1" required /></label>
            <label><span>COSTO UNITARIO</span><input name="unitCost" inputMode="numeric" pattern="[0-9]*" placeholder="150000" /></label>
          </div>
          <div className="admin-form-grid three">
            <label><span>GASTOS DE COMPRA</span><input name="purchaseExpense" inputMode="numeric" pattern="[0-9]*" placeholder="Transporte" /></label>
            <label><span>PROVEEDOR</span><input name="supplier" placeholder="Nombre del proveedor" /></label>
            <label><span>NOTA</span><input name="note" placeholder="Pedido / referencia" /></label>
          </div>
          <button className="admin-primary-action" type="submit">REGISTRAR COMPRA</button>
        </form>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>COSTOS</span><h2>REFERENCIAS</h2></div></div>
        <div className="inventory-product-strip">
          {data.products.map((product) => (
            <article className="inventory-product-card" key={product.id}>
              <div className="inventory-product-image"><img src={`/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`} alt={product.name} /></div>
              <span>{product.brand || "GIRTZ"}</span><h3>{product.name}</h3>
              <strong>{product.stockQuantity} unidades registradas</strong>
              <div className="inventory-size-chips">{product.variants.length ? product.variants.map((variant) => <small key={variant.id}>EUR {variant.size}: {Math.max(0, variant.stockQuantity || 0)}</small>) : <small>SIN STOCK REGISTRADO</small>}</div>
              <div className="admin-product-note compact"><span>Costo: <strong>{formatCop(product.cost)}</strong></span><span>Venta: <strong>{formatCop(product.price)}</strong></span><span>Utilidad bruta/unidad: <strong>{formatCop(product.projectedGrossProfitPerUnit)}</strong></span><span>Valor inventario: <strong>{formatCop(product.inventoryValue)}</strong></span></div>
              <a href={`/admin/inventory?product=${product.id}`}>REGISTRAR COMPRA</a>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-heading"><div><span>HISTORIAL</span><h2>ÚLTIMOS MOVIMIENTOS</h2></div></div>
        <div className="inventory-movement-list">
          {data.movements.length ? data.movements.map((movement) => (
            <article key={movement.id}><div><span>{movement.movementType.toUpperCase()}</span><strong>{movement.productName}</strong><small>Talla {movement.size || "—"} · {movement.quantity} und.</small></div><div><strong>{movement.unitCost ? formatCop(movement.unitCost) : "—"}</strong><small>{movement.supplier || "Sin proveedor"}</small></div></article>
          )) : <div className="admin-empty">Aún no hay movimientos.</div>}
        </div>
      </section>
    </section>
  );
}
