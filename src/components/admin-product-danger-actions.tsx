"use client";

import { useState } from "react";
import { archiveProduct, deleteProduct } from "@/app/admin/products/delete-actions";

type AdminProductDangerActionsProps = {
  productId: string;
  productName: string;
  imageUrl: string;
  active?: boolean;
  compact?: boolean;
};

export function AdminProductDangerActions({
  productId,
  productName,
  imageUrl,
  active = true,
  compact = false,
}: AdminProductDangerActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={compact ? "admin-danger-actions compact" : "admin-danger-actions"}>
        {!compact && active ? (
          <form action={archiveProduct}>
            <input type="hidden" name="productId" value={productId} />
            <button type="submit" className="admin-danger-secondary">DESACTIVAR PRODUCTO</button>
          </form>
        ) : null}
        <button type="button" className="admin-danger-trigger" onClick={() => setOpen(true)}>
          ELIMINAR
        </button>
      </div>

      {open ? (
        <div className="admin-delete-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="admin-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${productId}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-delete-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={productName} />
            </div>
            <div className="admin-delete-copy">
              <span>ELIMINAR PRODUCTO</span>
              <h2 id={`delete-title-${productId}`}>¿Eliminar {productName}?</h2>
              <p>
                Si este producto ya tiene ventas o movimientos, no se borrará el historial: se archivará y dejará de aparecer en la tienda.
              </p>
            </div>
            <div className="admin-delete-actions">
              <button type="button" className="admin-delete-cancel" onClick={() => setOpen(false)}>
                CANCELAR
              </button>
              <form action={deleteProduct}>
                <input type="hidden" name="productId" value={productId} />
                <button type="submit" className="admin-delete-confirm">SÍ, ELIMINAR</button>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
