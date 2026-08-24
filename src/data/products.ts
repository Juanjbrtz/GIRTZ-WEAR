export type Product = {
  slug: string;
  name: string;
  eyebrow: string;
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
    eyebrow: "DROP 001",
    price: 199900,
    image:
      "https://images.unsplash.com/photo-1778521157912-620fd0d3c6e1?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneakers en una exhibición de estudio con luz cálida",
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    description:
      "Una silueta urbana para rotar todos los días. Perfil limpio, presencia fuerte y combinación fácil.",
  },
  {
    slug: "whitecode-02",
    name: "WHITECODE 02",
    eyebrow: "ESSENTIAL",
    price: 194900,
    image:
      "https://images.unsplash.com/photo-1625860191460-10a66c7384fb?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker blanco en una composición minimalista",
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    description:
      "Minimalismo total para looks claros y oscuros. Una referencia limpia que deja hablar al outfit.",
  },
  {
    slug: "afterdark-03",
    name: "AFTERDARK 03",
    eyebrow: "SELECTED",
    price: 209900,
    image:
      "https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker blanco sobre una superficie de madera oscura",
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    description:
      "Contraste, textura y una estética pensada para la noche. Fácil de usar, difícil de ignorar.",
  },
  {
    slug: "signal-04",
    name: "SIGNAL 04",
    eyebrow: "NEW SIGNAL",
    price: 204900,
    image:
      "https://images.unsplash.com/photo-1584590069631-1c180f90a54c?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    imageAlt: "Sneaker claro sobre un fondo naranja intenso",
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    description:
      "Una referencia para romper la neutralidad. Volumen deportivo y actitud de calle en la misma rotación.",
  },
];

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
