"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createProductFromBatch } from "@/app/admin/products/bulk-actions";

type Audience = "Hombre" | "Mujer" | "Unisex";
type UploadStatus = "ready" | "publishing" | "done" | "error";

type BatchItem = {
  id: string;
  file: File;
  preview: string;
  name: string;
  brand: string;
  audience: Audience;
  price: string;
  cost: string;
  status: UploadStatus;
  error?: string;
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 7 * 1024 * 1024;
const maxBatch = 30;

function filenameToName(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function AdminBulkProductUpload() {
  const router = useRouter();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "ready" || item.status === "error").length,
    [items],
  );

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).slice(0, maxBatch);
    const valid = selected.filter((file) => allowedTypes.has(file.type) && file.size <= maxBytes);
    const rejected = selected.length - valid.length;

    setItems((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.preview));
      return valid.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        name: filenameToName(file.name),
        brand: "",
        audience: "Unisex",
        price: "",
        cost: "",
        status: "ready",
      }));
    });

    if (selected.length > maxBatch) {
      setMessage(`Puedes cargar hasta ${maxBatch} fotos por lote. Se tomaron las primeras ${maxBatch}.`);
    } else if (rejected > 0) {
      setMessage(`${rejected} foto(s) no se cargaron por formato o por superar 7 MB.`);
    } else {
      setMessage(null);
    }
  }

  function updateItem(id: string, patch: Partial<BatchItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, status: item.status === "done" ? "done" : "ready", error: undefined } : item));
  }

  function removeItem(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function publishBatch() {
    if (!pendingCount || publishing) return;
    const invalid = items.find((item) => item.status !== "done" && (!item.name.trim() || Number(item.price) <= 0));
    if (invalid) {
      setMessage("Cada foto debe tener nombre y precio antes de publicar el lote.");
      return;
    }

    setPublishing(true);
    setMessage(null);
    let published = 0;
    let failed = 0;

    for (const item of items) {
      if (item.status === "done") continue;
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "publishing", error: undefined } : entry));

      const formData = new FormData();
      formData.set("image", item.file);
      formData.set("name", item.name.trim());
      formData.set("brand", item.brand.trim());
      formData.set("audience", item.audience);
      formData.set("price", item.price);
      formData.set("cost", item.cost || "0");

      try {
        await createProductFromBatch(formData);
        published += 1;
        setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "done", error: undefined } : entry));
      } catch (error) {
        failed += 1;
        const errorMessage = error instanceof Error ? error.message : "No fue posible publicar esta foto.";
        setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "error", error: errorMessage } : entry));
      }
    }

    setPublishing(false);
    setMessage(failed ? `${published} producto(s) publicados y ${failed} con error. Puedes corregirlos y reintentar.` : `${published} producto(s) publicados correctamente.`);
    router.refresh();
  }

  return (
    <section className="admin-panel-block">
      <div className="admin-block-heading">
        <div>
          <span>CARGA MASIVA POR FOTOS</span>
          <h2>SUBIR VARIOS PRODUCTOS</h2>
        </div>
        {items.length ? <strong>{items.length} FOTOS</strong> : null}
      </div>

      <div className="admin-form">
        <label className="admin-file-picker">
          <span>SELECCIONAR VARIAS FOTOS</span>
          <small>Hasta {maxBatch} por lote · JPG, PNG, WEBP o AVIF · máximo 7 MB por foto</small>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFiles} />
        </label>

        {message ? <div className="admin-success">{message}</div> : null}

        {items.length ? (
          <div className="admin-catalog-carousel" aria-label="Productos pendientes de publicar">
            {items.map((item) => (
              <article key={item.id} className="admin-catalog-card">
                <div className="admin-catalog-image">
                  <img src={item.preview} alt={item.name || "Vista previa"} />
                  {item.status === "done" ? <span>PUBLICADO</span> : null}
                </div>

                <div className="admin-form">
                  <label>
                    <span>NOMBRE *</span>
                    <input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} disabled={item.status === "done"} />
                  </label>
                  <label>
                    <span>MARCA</span>
                    <input value={item.brand} onChange={(event) => updateItem(item.id, { brand: event.target.value })} placeholder="Nike, Adidas..." disabled={item.status === "done"} />
                  </label>
                  <label>
                    <span>SECCIÓN</span>
                    <select value={item.audience} onChange={(event) => updateItem(item.id, { audience: event.target.value as Audience })} disabled={item.status === "done"}>
                      <option>Hombre</option>
                      <option>Mujer</option>
                      <option>Unisex</option>
                    </select>
                  </label>
                  <label>
                    <span>PRECIO *</span>
                    <input type="number" min="1" step="100" value={item.price} onChange={(event) => updateItem(item.id, { price: event.target.value })} placeholder="200000" disabled={item.status === "done"} />
                  </label>
                  <label>
                    <span>COSTO</span>
                    <input type="number" min="0" step="100" value={item.cost} onChange={(event) => updateItem(item.id, { cost: event.target.value })} placeholder="150000" disabled={item.status === "done"} />
                  </label>
                </div>

                {item.error ? <small>{item.error}</small> : null}
                <div className="admin-catalog-actions">
                  <button type="button" onClick={() => removeItem(item.id)} disabled={publishing || item.status === "publishing"}>QUITAR</button>
                  <span>{item.status === "publishing" ? "PUBLICANDO..." : item.status === "error" ? "REVISAR" : item.status === "done" ? "LISTO" : "PENDIENTE"}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">Selecciona las fotos del catálogo. Cada foto se convertirá en una tarjeta para completar sus datos.</div>
        )}

        {items.length ? (
          <button type="button" className="admin-primary-action admin-submit" onClick={publishBatch} disabled={!pendingCount || publishing}>
            {publishing ? "PUBLICANDO LOTE..." : `PUBLICAR ${pendingCount} PRODUCTO${pendingCount === 1 ? "" : "S"}`}
          </button>
        ) : null}
      </div>
    </section>
  );
}
