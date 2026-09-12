import Link from "next/link";
import { createProduct, toggleProductActive, updateWhatsappNumber } from "@/app/admin/actions";
import { AdminBulkProductUpload } from "@/components/admin-bulk-product-upload";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { formatCop } from "@/data/products";
import { getWhatsappNumber } from "@/lib/store-settings";
import { getAdminProducts } from "@/lib/store-data";

type ProductsPageProps = { searchParams: Promise<{ created?: string; whatsapp?: string; duplicate?: string }> };

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const [{ created, whatsapp, duplicate }, catalog, whatsappNumber] = await Promise.all([searchParams, getAdminProducts(), getWhatsappNumber()]);

  return (
    <section className="admin-section admin-products-v2">
      <header className="admin-heading admin-heading-v2">
        <div><span>CATÁLOGO / GESTIÓN</span><h1>PRODUCTOS</h1><p>Sube fotos, define precio y costo y publica directamente en la tienda.</p></div>
        <div className="admin-count">{catalog.filter((item) => item.active).length} PUBLICADOS</div>
      </header>

      {created === "1" ? <div className="admin-success">Producto creado y publicado.</div> : null}
      {whatsapp === "1" ? <div className="admin-success">Número de WhatsApp actualizado.</div> : null}
      {duplicate === "1" ? <div className="admin-success">Esa referencia ya existe. No se creó una copia duplicada.</div> : null}

      <AdminBulkProductUpload />

      <section className="admin-settings-strip">
        <div><span>CIERRE DE VENTA</span><h2>WHATSAPP DE LA TIENDA</h2><p>El carrito enviará aquí el resumen de la selección para confirmar disponibilidad y cerrar la compra.</p></div>
        <form action={updateWhatsappNumber} className="admin-whatsapp-form">
          <label><span>NÚMERO CON INDICATIVO</span><input name="whatsappNumber" type="tel" inputMode="numeric" defaultValue={whatsappNumber} placeholder="573001234567" /></label>
          <button type="submit" className="admin-primary-action">GUARDAR WHATSAPP</button>
        </form>
      </section>

      <div className="admin-products-layout-v2">
        <section className="admin-panel-block product-create-panel-v2">
          <div className="admin-block-heading"><div><span>NUEVA REFERENCIA</span><h2>SUBIR UNA FOTO</h2></div></div>
          <form action={createProduct} className="admin-form admin-product-form-v2">
            <AdminImageUpload required />
            <div className="admin-form-grid two">
              <label><span>NOMBRE *</span><input name="name" placeholder="New Balance 9060" required /></label>
              <label><span>MARCA</span><input name="brand" placeholder="New Balance" /></label>
            </div>
            <div className="admin-form-grid three">
              <label><span>SECCIÓN *</span><select name="audience" defaultValue="Unisex" required><option>Hombre</option><option>Mujer</option><option>Unisex</option></select></label>
              <label><span>PRECIO DE VENTA *</span><input name="price" inputMode="numeric" pattern="[0-9]*" placeholder="220000" required /></label>
              <label><span>COSTO</span><input name="cost" inputMode="numeric" pattern="[0-9]*" placeholder="150000" /></label>
            </div>
            <label><span>DESCRIPCIÓN <small>Opcional</small></span><textarea name="description" rows={3} placeholder="Detalles del modelo." /></label>
            <div className="admin-check-row">
              <label className="admin-check"><input name="active" type="checkbox" defaultChecked /><span>PUBLICAR EN LA TIENDA</span></label>
              <label className="admin-check"><input name="featured" type="checkbox" /><span>USAR COMO DESTACADO / PORTADA</span></label>
            </div>
            <button className="admin-primary-action admin-submit" type="submit">SUBIR FOTO Y PUBLICAR</button>
          </form>
        </section>

        <section className="admin-panel-block admin-catalog-panel-v2">
          <div className="admin-block-heading"><div><span>CATÁLOGO ACTUAL</span><h2>{catalog.length} REFERENCIAS</h2></div></div>
          {catalog.length ? (
            <div className="admin-product-list-v2">
              {catalog.map((product) => (
                <article key={product.id} className="admin-product-row-v2">
                  <div className="admin-product-thumb"><img src={`/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`} alt={product.name} /></div>
                  <div className="admin-product-copy">
                    <div className="admin-product-badges"><span>{product.brand || "GIRTZ"}</span><span>{product.audience || "UNISEX"}</span>{product.featured ? <b>PORTADA</b> : null}{!product.active ? <i>OCULTO</i> : null}</div>
                    <strong>{product.name}</strong>
                    <small>Costo {formatCop(product.cost)} · utilidad bruta estimada {formatCop(Math.max(0, product.price - product.cost))}</small>
                  </div>
                  <div className="admin-product-price-v2"><strong>{formatCop(product.price)}</strong></div>
                  <div className="admin-product-actions-v2">
                    <Link href={`/admin/products/${product.id}/edit`} className="admin-ghost-action">EDITAR</Link>
                    <form action={toggleProductActive}><input type="hidden" name="productId" value={product.id} /><input type="hidden" name="active" value={product.active ? "false" : "true"} /><button type="submit" className="admin-ghost-action">{product.active ? "OCULTAR" : "PUBLICAR"}</button></form>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="admin-empty admin-empty-v2"><strong>EL CATÁLOGO ESTÁ LISTO.</strong><span>Sube la primera foto para comenzar.</span></div>}
        </section>
      </div>
    </section>
  );
}
