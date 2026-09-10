export type Audience = "Hombre" | "Mujer" | "Unisex";

export type ProductVariant = {
  id: string;
  size: string;
  stockQuantity: number;
  available: boolean;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  audience: Audience;
  price: number;
  cost?: number;
  image: string;
  imageAlt: string;
  sizes: string[];
  variants: ProductVariant[];
  stockQuantity: number;
  description: string;
  featured?: boolean;
};

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
