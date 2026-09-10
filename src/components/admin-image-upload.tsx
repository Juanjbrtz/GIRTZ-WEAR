"use client";

import { useEffect, useState, type ChangeEvent } from "react";

export function AdminImageUpload({
  name = "image",
  required = false,
  currentImage,
}: {
  name?: string;
  required?: boolean;
  currentImage?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(currentImage || null);
      setFileName("");
      return;
    }

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);
    setPreview(nextUrl);
    setFileName(file.name);
  }

  return (
    <div className="admin-image-field">
      <div className="admin-image-preview">
        {preview ? <img src={preview} alt="Vista previa de la foto del producto" /> : <span>FOTO DEL PRODUCTO</span>}
      </div>
      <label className="admin-file-picker">
        <span>{currentImage ? "CAMBIAR FOTO" : "SUBIR FOTO"}</span>
        <small>Desde cámara, galería o archivos · JPG, PNG, WEBP o AVIF · máximo 7 MB</small>
        {fileName ? <strong>{fileName}</strong> : null}
        <input
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required={required}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
