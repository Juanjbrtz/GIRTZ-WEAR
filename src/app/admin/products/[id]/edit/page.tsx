import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct } from "@/app/admin/actions";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { formatCop } from "@/data/products";
import { getAdminProducts } from "@/lib/store-data";

type EditProductPageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const [{ id }, { saved }, catalog] = await Promise.all([params, searchParams, getAdminProducts()]);
  const product = catalog.find((entry) => entry.id === id);
  if (!product) notFound();
  const currentImage = `/api/product-image/${product.id}?v=${product.updatedAt.getTime()}`;

  return (
    <section className="admin-section admin-edit-product">
      <header className="admin-heading admin-heading-v2">
        <div><span>PRODUCTOS / EDITAR</span><h1>{product.name}</h1><p>{product.brand} · {product.audience} · venta {formatCop(product.price)} · costo {formatCop(product.cost)}</p></div>
        <Link href="/admin/products" className="admin-ghost-action">VOLVER</Link>
      </header>
      {saved === "1" ? <div className="admin-success">Cambios guardados correctamente.</div> : null}
      <section className="admin-panel-block admin-edit-panel">
        <form action={updateProduct} className="admin-form admin-product-form-v2">
          <input type="hidden" name="productId" value={product.id} />
          <AdminImageUpload currentImage={currentImage} />
          <div className="admin-form-grid two">
            <label><span>NOMBRE *</span><input name="name" defaultValue={product.name} required /></label>
            <label><span>MARCA</span><input name="brand" defaultValue={product.brand || ""} /></label>
          </div>
          <div className="admin-form-grid three">
            <label><span>SECCIÓN *</span><select name="audience" defaultValue={product.audience || "Unisex"} required><option>Hombre</option><option>Mujer</option><option>Unisex</option></select></label>
            <label><span>PRECIO DE VENTA *</span><input name="price" inputMode="numeric" pattern="[0-9]*" defaultValue={product.price} required /></label>
            <label><span>COSTO</span><input name="cost" inputMode="numeric" pattern="[0-9]*" defaultValue={product.cost} /></label>
          </div>
          <label><span>DESCRIPCIÓN</span><textarea name="description" rows={4} defaultValue={product.description || ""} /></label>
          <div className="admin-product-note"><strong>UTILIDAD BRUTA ESTIMADA</strong><span>{formatCop(Math.max(0, product.price - product.cost))} por unidad antes de gastos.</span></div>
          <div className="admin-check-row">
            <label className="admin-check"><input name="active" type="checkbox" defaultChecked={product.active} /><span>PUBLICAR EN LA TIENDA</span></label>
            <label className="admin-check"><input name="featured" type="checkbox" defaultChecked={product.featured} /><span>USAR COMO DESTACADO / PORTADA</span></label>
          </div>
          <button className="admin-primary-action admin-submit" type="submit">GUARDAR CAMBIOS</button>
        </form>
      </section>
    </section>
  );
}
