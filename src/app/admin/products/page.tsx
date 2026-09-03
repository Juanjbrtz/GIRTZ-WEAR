import Link from "next/link";
import {
  createProduct,
  toggleProductActive,
  updateWhatsappNumber,
} from "@/app/admin/actions";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { formatCop } from "@/data/products";
import { getWhatsappNumber } from "@/lib/store-settings";
import { getAdminProducts } from "@/lib/store-data";

type ProductsPageProps = {
  searchParams: Promise<{ created?: string; whatsapp?: string }>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const [{ created, whatsapp }, catalog, whatsappNumber] = await Promise.all([
    searchParams,
    getAdminProducts(),
    getWhatsappNumber(),
  ]);

  return (
    <section className="admin-section admin-products-v2">
      <header className="admin-heading admin-heading-v2">
        <div>
          <span>CATÁLOGO / GESTIÓN</span>
          <h1>PRODUCTOS</h1>
          <p>Todo lo que publiques aquí aparece directamente en la tienda.</p>
        </div>
        <div className="admin-count">{catalog.filter((item) => item.active).length} PUBLICADOS</div>
      </header>

      {created === "1" ? (
        <div className="admin-success">Producto creado. Ya puede verse en el catálogo.</div>
      ) : null}
      {whatsapp === "1" ? (
        <div className="admin-success">Número de WhatsApp actualizado.</div>
      ) : null}

      <section className="admin-settings-strip">
        <div>
          <span>CANAL DE CONSULTA</span>
          <h2>WHATSAPP DE LA TIENDA</h2>
          <p>
            Puedes dejarlo vacío por ahora. Cuando lo agregues, todos los botones de consulta
            de la tienda usarán este número automáticamente.
          </p>
        </div>
        <form action={updateWhatsappNumber} className="admin-whatsapp-form">
          <label>
            <span>NÚMERO CON INDICATIVO DE PAÍS</span>
            <input
              name="whatsappNumber"
              type="tel"
              inputMode="numeric"
              defaultValue={whatsappNumber}
              placeholder="573001234567"
            />
          </label>
          <button type="submit" className="admin-primary-action">
            GUARDAR WHATSAPP
          </button>
        </form>
      </section>

      <div className="admin-products-layout-v2">
        <section className="admin-panel-block product-create-panel-v2">
          <div className="admin-block-heading">
            <div>
              <span>NUEVA REFERENCIA</span>
              <h2>AGREGAR PRODUCTO</h2>
            </div>
          </div>

          <form action={createProduct} className="admin-form admin-product-form-v2">
            <AdminImageUpload required />

            <div className="admin-form-grid two">
              <label>
                <span>NOMBRE DEL MODELO *</span>
                <input name="name" type="text" placeholder="Air Max 90" required />
              </label>
              <label>
                <span>MARCA *</span>
                <input name="brand" type="text" placeholder="Nike" required />
              </label>
            </div>

            <div className="admin-form-grid two">
              <label>
                <span>SECCIÓN *</span>
                <select name="audience" required defaultValue="Unisex">
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>Unisex</option>
                </select>
              </label>
              <label>
                <span>PRECIO *</span>
                <input name="price" type="number" min="1" step="100" placeholder="199900" required />
              </label>
            </div>

            <label>
              <span>DESCRIPCIÓN <small>Opcional</small></span>
              <textarea
                name="description"
                rows={4}
                placeholder="Detalles relevantes del modelo. La disponibilidad de tallas se consulta por WhatsApp."
              />
            </label>

            <div className="admin-product-note">
              <strong>TALLAS</strong>
              <span>En la tienda aparecerá “Consultar disponibilidad”. No necesitas cargar inventario por talla.</span>
            </div>

            <div className="admin-check-row">
              <label className="admin-check">
                <input name="active" type="checkbox" defaultChecked />
                <span>PUBLICAR EN LA TIENDA</span>
              </label>
              <label className="admin-check">
                <input name="featured" type="checkbox" />
                <span>USAR COMO PRODUCTO DESTACADO / PORTADA</span>
              </label>
            </div>

            <button className="admin-primary-action admin-submit" type="submit">
              PUBLICAR PRODUCTO
            </button>
          </form>
        </section>

        <section className="admin-panel-block admin-catalog-panel-v2">
          <div className="admin-block-heading">
            <div>
              <span>CATÁLOGO ACTUAL</span>
              <h2>{catalog.length} REFERENCIAS</h2>
            </div>
          </div>

          {catalog.length ? (
            <div className="admin-product-list-v2">
              {catalog.map((product) => (
                <article key={product.id} className="admin-product-row-v2">
                  <div className="admin-product-thumb">
                    <img
                      src={`/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`}
                      alt={product.name}
                    />
                  </div>
                  <div className="admin-product-copy">
                    <div className="admin-product-badges">
                      <span>{product.brand || "SIN MARCA"}</span>
                      <span>{product.audience || "UNISEX"}</span>
                      {product.featured ? <b>PORTADA</b> : null}
                      {!product.active ? <i>OCULTO</i> : null}
                    </div>
                    <strong>{product.name}</strong>
                    <small>Tallas: consultar disponibilidad</small>
                  </div>
                  <div className="admin-product-price-v2">
                    <strong>{formatCop(product.price)}</strong>
                  </div>
                  <div className="admin-product-actions-v2">
                    <Link href={`/admin/products/${product.id}/edit`} className="admin-ghost-action">
                      EDITAR
                    </Link>
                    <form action={toggleProductActive}>
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="active" value={product.active ? "false" : "true"} />
                      <button type="submit" className="admin-ghost-action">
                        {product.active ? "OCULTAR" : "PUBLICAR"}
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty admin-empty-v2">
              <strong>EL CATÁLOGO ESTÁ LISTO PARA EMPEZAR.</strong>
              <span>Sube el primer producto con una fotografía original en buena calidad.</span>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
