import { DEFAULT_EUR_SIZES } from "@/lib/sizes";

type AdminSizeSelectorProps = {
  selectedSizes?: string[];
  label?: string;
  hint?: string;
};

export function AdminSizeSelector({
  selectedSizes = [],
  label = "TALLAS EUR *",
  hint = "Selecciona las tallas que puede solicitar el cliente. La disponibilidad final se confirma por WhatsApp.",
}: AdminSizeSelectorProps) {
  const selected = new Set(selectedSizes.map((size) => String(size).trim()));

  return (
    <fieldset className="admin-size-selector">
      <legend>{label}</legend>
      <small>{hint}</small>
      <div className="admin-size-options">
        {DEFAULT_EUR_SIZES.map((size) => (
          <label key={size} className="admin-size-option">
            <input name="sizes" type="checkbox" value={size} defaultChecked={selected.has(size)} />
            <span>{size}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
