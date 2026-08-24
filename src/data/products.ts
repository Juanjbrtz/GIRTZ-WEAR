export type Audience = "Hombre" | "Mujer" | "Unisex";

export type Product = {
  slug: string;
  name: string;
  audience: Audience;
  price: number;
  image: string;
  imageAlt: string;
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  {
    slug: "nightshift-01",
    name: "NIGHTSHIFT 01",
    audience: "Hombre",
    price: 199900,
    image:
      "https://images.unsplash.com/photo-1778521157912-620fd0d3c6e1?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneakers en una exhibición de estudio con luz cálida",
    sizes: ["38", "39", "40", "41", "42", "43"],
    description:
      "Una referencia urbana de perfil limpio, pensada para rotación diaria y combinaciones versátiles.",
  },
  {
    slug: "whitecode-02",
    name: "WHITECODE 02",
    audience: "Mujer",
    price: 194900,
    image:
      "https://images.unsplash.com/photo-1625860191460-10a66c7384fb?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker blanco en una composición minimalista",
    sizes: ["35", "36", "37", "38", "39", "40"],
    description:
      "Una silueta limpia y fácil de combinar, seleccionada para looks casuales y urbanos.",
  },
  {
    slug: "afterdark-03",
    name: "AFTERDARK 03",
    audience: "Unisex",
    price: 209900,
    image:
      "https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker blanco sobre una superficie de madera oscura",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    description:
      "Una referencia versátil con presencia sobria, pensada para distintos estilos y ocasiones.",
  },
  {
    slug: "signal-04",
    name: "SIGNAL 04",
    audience: "Unisex",
    price: 204900,
    image:
      "https://images.unsplash.com/photo-1584590069631-1c180f90a54c?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker claro sobre un fondo naranja intenso",
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    description:
      "Una opción de volumen deportivo y estética contemporánea para una rotación más marcada.",
  },
];

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
