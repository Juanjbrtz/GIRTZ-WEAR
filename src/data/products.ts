export type Audience = "Hombre" | "Mujer" | "Unisex";

export type ProductSprite = {
  src: string;
  index: number;
  columns: number;
  rows: number;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  audience: Audience;
  price: number;
  image: string;
  imageAlt: string;
  sizes: string[];
  description: string;
  featured?: boolean;
  catalogBatch?: number;
  catalogReference?: string;
  sprite?: ProductSprite;
};

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
