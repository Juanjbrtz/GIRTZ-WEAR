"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createProductFromBatch } from "@/app/admin/products/bulk-actions";
import { DEFAULT_EUR_SIZES } from "@/lib/sizes";
import { getShortUserError } from "@/lib/user-errors";

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
  sizes: string[];
  status: UploadStatus;
  error?: string;
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 7 * 1024 * 1024;
const maxBatch = 30;

function filenameToName(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}
function onlyDigits(value: string) { return value.replace(/\D/g, "").slice(0, 10); }
function fileFingerprint(file: File) { return `${file.name.toLowerCase()}-${file.size}-${file.lastModified}`; }

export function AdminBulkProductUpload() {
  const router = useRouter();
  const publishingLock = useRef(false);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [batchSizes, setBatchSizes] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const pendingCount = useMemo(() => items.filter((item) => item.status === "ready" || item.status === "error").length, [items]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).slice(0, maxBatch);
    const seen = new Set<string>();
    const valid = selected.filter((file) => {
      if (!allowedTypes.has(file.type) || file.size > maxBytes) return false;
      const key = fileFingerprint(file);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setItems((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.preview));
      return valid.map((file) => ({
        id: fileFingerprint(file),
        file,
        preview: URL.createObjectURL(file),
        name: filenameToName(file.name),
        brand: "",
        audience: "Unisex",
        price: "",
        cost: "",
        sizes: [...batchSizes],
        status: "ready",
      }));
    });
    const rejected = selected.length - valid.length;
    setMessage(rejected ? `${rejected} foto(s) fueron omitidas por repetirse, superar 7 MB o usar un formato no compatible.` : null);
    event.target.value = "";
  }

  function updateItem(id: string, patch: Partial<BatchItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, status: item.status === "done" ? "done" : "ready", error: undefined } : item));
  }

  function toggleBatchSize(size: string) {
    setBatchSizes((current) => current.includes(size) ? current.filter((entry) => entry !== size) : [...current, size]);
  }

  function toggleItemSize(id: string, size: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item || item.status === "done") return;
    const nextSizes = item.sizes.includes(size) ? item.sizes.filter((entry) => entry !== size) : [...item.sizes, size];
    updateItem(id, { sizes: nextSizes });
  }

  function applyBatchSizes() {
    if (!batchSizes.length) return;
    setItems((current) => current.map((item) => item.status === "done" ? item : { ...item, sizes: [...batchSizes], status: "ready", error: undefined }));
  }

  function removeItem(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function publishBatch() {
    if (!pendingCount || publishingLock.current) return;
    if (items.some((item) => item.status !== "done" && (!item.name.trim() || Number(item.price) < 100 || !item.sizes.length))) {
      setMessage("Cada foto debe tener nombre, precio válido y al menos una talla EUR antes de publicar.");
      return;
    }
    publishingLock.current = true;
    setPublishing(true);
    let published = 0; let duplicates = 0; let failed = 0;
    try {
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
        item.sizes.forEach((size) => formData.append("sizes", size));
        try {
          const result = await createProductFromBatch(formData);
          result.duplicate ? duplicates++ : published++;
          setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "done", error: undefined } : entry));
        } catch (error) {
          failed++;
          const errorMessage = getShortUserError(error, "No fue posible publicar este producto.");
          setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "error", error: errorMessage } : entry));
        }
      }
    } finally {
      publishingLock.current = false;
      setPublishing(false);
    }
    setMessage(failed ? `${published} publicados, ${duplicates} repetidos bloqueados y ${failed} con error.` : duplicates ? `${published} publicados. ${duplicates} repetidos fueron bloqueados automáticamente.` : `${published} producto(s) publicados correctamente.`);
    router.refresh();
  }

  return (
    <section className="admin-panel-block bulk-upload-panel">
      <div className="admin-block-heading"><div><span>CARGA MASIVA</span><h2>SUBIR CATÁLOGO POR FOTOS</h2></div>{items.length ? <strong>{items.length} FOTOS</strong> : null}</div>
      <label className="bulk-file-picker"><span>SELECCIONAR VARIAS FOTOS</span><small>Hasta {maxBatch} por lote · JPG, PNG, WEBP o AVIF · máximo 7 MB</small><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFiles} /></label>

      <div className="bulk-size-preset">
        <div className="bulk-size-preset-head">
          <div><div className="bulk-size-title">TALLAS EUR PARA EL LOTE</div><span className="bulk-size-copy">Selecciona una base para las fotos del lote. Después puedes ajustar cada producto por separado.</span></div>
          <span className="bulk-size-count">{batchSizes.length} SELECCIONADAS</span>
        </div>
        <div className="bulk-size-options">
          {DEFAULT_EUR_SIZES.map((size) => (
            <button key={size} type="button" className={`bulk-size-chip${batchSizes.includes(size) ? " is-selected" : ""}`} onClick={() => toggleBatchSize(size)}>{size}</button>
          ))}
        </div>
        <div className="bulk-size-preset-actions">
          <button type="button" className="bulk-size-mini-action" onClick={() => setBatchSizes([...DEFAULT_EUR_SIZES])}>TODAS</button>
          <button type="button" className="bulk-size-mini-action" onClick={() => setBatchSizes([])}>LIMPIAR</button>
          {items.length ? <button type="button" className="bulk-size-mini-action" onClick={applyBatchSizes} disabled={!batchSizes.length}>APLICAR A TODO EL LOTE</button> : null}
        </div>
      </div>

      {message ? <div className="admin-success">{message}</div> : null}
      {items.length ? (
        <div className="bulk-product-grid">
          {items.map((item) => (
            <article key={item.id} className="bulk-product-card">
              <div className="bulk-product-photo"><img src={item.preview} alt={item.name || "Vista previa"} />{item.status === "done" ? <span>PUBLICADO</span> : null}</div>
              <div className="bulk-product-fields">
                <label><span>NOMBRE *</span><input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} disabled={item.status === "done"} /></label>
                <label><span>MARCA</span><input value={item.brand} onChange={(e) => updateItem(item.id, { brand: e.target.value })} placeholder="New Balance" disabled={item.status === "done"} /></label>
                <label><span>SECCIÓN</span><select value={item.audience} onChange={(e) => updateItem(item.id, { audience: e.target.value as Audience })} disabled={item.status === "done"}><option>Hombre</option><option>Mujer</option><option>Unisex</option></select></label>
                <label><span>PRECIO *</span><input inputMode="numeric" value={item.price} onChange={(e) => updateItem(item.id, { price: onlyDigits(e.target.value) })} placeholder="220000" disabled={item.status === "done"} /></label>
                <label><span>COSTO</span><input inputMode="numeric" value={item.cost} onChange={(e) => updateItem(item.id, { cost: onlyDigits(e.target.value) })} placeholder="150000" disabled={item.status === "done"} /></label>
              </div>

              <div className="bulk-item-sizes">
                <div className="bulk-item-sizes-head"><div className="bulk-size-title">TALLAS EUR *</div><span className="bulk-size-count">{item.sizes.length} SELECCIONADAS</span></div>
                <div className="bulk-size-options">
                  {DEFAULT_EUR_SIZES.map((size) => (
                    <button key={size} type="button" className={`bulk-size-chip${item.sizes.includes(size) ? " is-selected" : ""}`} onClick={() => toggleItemSize(item.id, size)} disabled={item.status === "done"}>{size}</button>
                  ))}
                </div>
                <div className="bulk-item-sizes-actions">
                  <button type="button" className="bulk-size-mini-action" onClick={() => updateItem(item.id, { sizes: [...DEFAULT_EUR_SIZES] })} disabled={item.status === "done"}>TODAS</button>
                  <button type="button" className="bulk-size-mini-action" onClick={() => updateItem(item.id, { sizes: [] })} disabled={item.status === "done"}>LIMPIAR</button>
                </div>
              </div>

              {item.error ? <small className="bulk-error">{item.error}</small> : null}
              <div className="bulk-product-actions"><button type="button" onClick={() => removeItem(item.id)} disabled={publishing || item.status === "publishing"}>QUITAR</button><span>{item.status === "publishing" ? "PUBLICANDO..." : item.status === "error" ? "REVISAR" : item.status === "done" ? "LISTO" : "PENDIENTE"}</span></div>
            </article>
          ))}
        </div>
      ) : <div className="admin-empty">Selecciona las fotos. Cada una se convierte en una tarjeta para completar nombre, marca, sección, precio, costo y tallas.</div>}
      {items.length ? <button type="button" className="admin-primary-action bulk-publish" onClick={publishBatch} disabled={!pendingCount || publishing}>{publishing ? "PUBLICANDO..." : `PUBLICAR ${pendingCount} PRODUCTO${pendingCount === 1 ? "" : "S"}`}</button> : null}
    </section>
  );
}
