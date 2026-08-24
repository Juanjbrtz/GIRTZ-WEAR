import { createProduct, toggleProductActive } from "@/app/admin/actions";
import { formatCop } from "@/data/products";
import { getAdminProducts } from "@/lib/store-data";

type ProductsPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const [{ created }, catalog] = await Promise.all([searchParams, getAdminProducts()]);

  return (
    <section className="admin-section">
      <header className="admin-heading">
        <div>
          <span>CATÁLOGO / GESTIÓN</span>
          <h1>PRODUCTOS</h1>
        </div>
        <div className="admin-count">{catalog.length} REGISTRADOS</div>
      </header>

      {created === "1" ? (
        <div className="admin-success">Producto creado y publicado en el catálogo.</div>
      ) : null}

      <div className="admin-products-layout">
        <section className="admin-panel-block product-create-panel">
          <div className="admin-block-heading">
            <div>
              <span>NUEVA REFERENCIA</span>
              <h2>SUBIR PRODUCTO</h2>
            </div>
          </div>

          <form action={createProduct} className="admin-form">
            <div className="admin-form-grid two">
              <label>
                <span>NOMBRE *</span>
                <input name="name" type="text" placeholder="Air Max 90" required />
              </label>
              <label>
                <span>MARCA *</span>
                <input name="brand" type="text" placeholder="Nike" required />
              </label>
            </div>

            <div className="admin-form-grid three">
              <label>
                <span>PÚBLICO *</span>
                <select name="audience" required defaultValue="Unisex">
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>Unisex</option>
                </select>
              </label>
              <label>
                <span>SKU</span>
                <input name="sku" type="text" placeholder="NK-AM90-001" />
              </label>
              <label>
                <span>STOCK POR TALLA</span>
                <input name="stockQuantity" type="number" min="0" defaultValue="1" />
              </label>
            </div>

            <div className="admin-form-grid two">
              <label>
                <span>PRECIO DE VENTA *</span>
                <input name="price" type="number" min="1" placeholder="209900" required />
              </label>
              <label>
                <span>COSTO *</span>
                <input name="cost" type="number" min="1" placeholder="160000" required />
              </label>
            </div>

            <label>
              <span>TALLAS * <small>Separadas por coma</small></span>
              <input name="sizes" type="text" placeholder="38, 39, 40, 41, 42" required />
            </label>

            <label>
              <span>IMAGEN DEL PRODUCTO *</span>
              <input name="imageUrl" type="url" placeholder="https://..." required />
            </label>

            <label>
              <span>DESCRIPCIÓN *</span>
              <textarea
                name="description"
                rows={4}
                placeholder="Descripción corta, comercial y clara de la referencia."
                required
              />
            </label>

            <div className="admin-check-row">
              <label className="admin-check">
                <input name="active" type="checkbox" defaultChecked />
                <span>PUBLICAR EN CATÁLOGO</span>
              </label>
              <label className="admin-check">
                <input name="featured" type="checkbox" />
                <span>DESTACADO</span>
              </label>
            </div>

            <button className="admin-primary-action admin-submit" type="submit">
              CREAR PRODUCTO
            </button>
          </form>
        </section>

        <section className="admin-panel-block">
          <div className="admin-block-heading">
            <div>
              <span>INVENTARIO</span>
              <h2>CATÁLOGO ACTUAL</h2>
            </div>
          </div>

          {catalog.length ? (
            <div className="admin-product-list">
              {catalog.map((product) => (
                <article key={product.id} className="admin-product-row">
                  <div>
                    <span>{product.brand || "SIN MARCA"} / {product.audience || "UNISEX"}</span>
                    <strong>{product.name}</strong>
                    <small>
                      {product.variants.map((variant) => variant.size).join(" · ") || "Sin tallas"}
                    </small>
                  </div>
                  <div className="admin-product-price">
                    <strong>{formatCop(product.price)}</strong>
                    <span>COSTO {formatCop(product.cost)}</span>
                  </div>
                  <form action={toggleProductActive}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="active" value={product.active ? "false" : "true"} />
                    <button type="submit" className="admin-ghost-action">
                      {product.active ? "DESACTIVAR" : "PUBLICAR"}
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">Aún no hay productos reales en Neon. Crea el primero desde este formulario.</div>
          )}
        </section>
      </div>
    </section>
  );
}
