import Link from "next/link";
import { createProduct, toggleProductActive } from "@/app/admin/actions";
import { AdminBulkProductUpload } from "@/components/admin-bulk-product-upload";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { formatCop } from "@/data/products";
import { getAdminProducts } from "@/lib/store-data";

type ProductsPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const [{ created }, catalog] = await Promise.all([searchParams, getAdminProducts()]);

  return (
    <section className="admin-section catalog-manager-app">
      <header className="admin-heading">
        <div>
          <span>TIENDA</span>
          <h1>CATÁLOGO</h1>
          <p>Sube una foto o selecciona varias desde tu celular o computador. No necesitas pegar URLs.</p>
        </div>
        <div className="admin-count">{catalog.filter((item) => item.active).length} PUBLICADOS</div>
      </header>

      {created === "1" ? <div className="admin-success">Producto agregado al catálogo con su foto.</div> : null}

      <AdminBulkProductUpload />

      <section className="quick-product-card">
        <div className="admin-block-heading">
          <div>
            <span>CARGA INDIVIDUAL</span>
            <h2>NUEVO PRODUCTO</h2>
          </div>
        </div>

        <form action={createProduct} className="quick-product-form">
          <AdminImageUpload required />

          <div className="quick-product-fields">
            <label>
              <span>NOMBRE</span>
              <input name="name" type="text" placeholder="Nike Air Max 90" required />
            </label>
            <label>
              <span>PRECIO</span>
              <input name="price" type="number" min="1" step="100" placeholder="200000" required />
            </label>
          </div>

          <details className="product-advanced-fields">
            <summary>MÁS OPCIONES</summary>
            <div className="admin-form-grid two">
              <label>
                <span>MARCA</span>
                <input name="brand" placeholder="Nike" />
              </label>
              <label>
                <span>SECCIÓN</span>
                <select name="audience" defaultValue="Unisex">
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>Unisex</option>
                </select>
              </label>
            </div>
            <div className="admin-form-grid two">
              <label>
                <span>COSTO DE REFERENCIA</span>
                <input name="cost" type="number" min="0" step="100" placeholder="150000" />
              </label>
              <label className="admin-check">
                <input name="featured" type="checkbox" />
                <span>DESTACAR EN PORTADA</span>
              </label>
            </div>
            <label>
              <span>DESCRIPCIÓN</span>
              <textarea name="description" rows={3} placeholder="Opcional" />
            </label>
          </details>

          <button className="admin-primary-action quick-publish-button" type="submit">SUBIR FOTO Y PUBLICAR</button>
        </form>
      </section>

      <section className="admin-panel-block catalog-carousel-block">
        <div className="admin-block-heading">
          <div>
            <span>PUBLICACIONES</span>
            <h2>{catalog.length} PRODUCTOS</h2>
          </div>
        </div>

        {catalog.length ? (
          <div className="admin-catalog-carousel" aria-label="Catálogo administrable">
            {catalog.map((product) => (
              <article key={product.id} className="admin-catalog-card">
                <Link href={`/admin/products/${product.id}/edit`} className="admin-catalog-image">
                  <img src={`/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`} alt={product.name} />
                  {product.featured ? <span>DESTACADO</span> : null}
                </Link>
                <div className="admin-catalog-copy">
                  <small>{product.brand || "GIRTZ"} · {product.audience || "Unisex"}</small>
                  <h3>{product.name}</h3>
                  <strong>{formatCop(product.price)}</strong>
                  <span>Costo {formatCop(product.cost)} · {product.stockQuantity} en inventario</span>
                </div>
                <div className="admin-catalog-actions">
                  <Link href={`/admin/inventory?product=${product.id}`}>INVENTARIO</Link>
                  <Link href={`/admin/products/${product.id}/edit`}>EDITAR</Link>
                  <form action={toggleProductActive}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="active" value={product.active ? "false" : "true"} />
                    <button type="submit">{product.active ? "OCULTAR" : "PUBLICAR"}</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">Sube las primeras fotos para empezar a construir el catálogo.</div>
        )}
      </section>
    </section>
  );
}
