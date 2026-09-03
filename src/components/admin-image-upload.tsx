"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(currentImage || null);
      return;
    }

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);
    setPreview(nextUrl);
  }

  return (
    <div className="admin-image-field">
      <div className="admin-image-preview">
        {preview ? <img src={preview} alt="Vista previa del producto" /> : <span>VISTA PREVIA</span>}
      </div>
      <label className="admin-file-picker">
        <span>{currentImage ? "CAMBIAR IMAGEN" : "CARGAR IMAGEN"}</span>
        <small>JPG, PNG, WEBP o AVIF · máximo 7 MB</small>
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
