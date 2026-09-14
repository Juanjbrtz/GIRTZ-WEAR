import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "GIRTZ Wear",
    short_name: "GIRTZ",
    description: "Sneakers multimarca. Explora el catálogo, arma tu selección y confirma disponibilidad por WhatsApp.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/pwa/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Catálogo", short_name: "Catálogo", url: "/shop", icons: [{ src: "/pwa/icon/192", sizes: "192x192" }] },
      { name: "Mi cuenta", short_name: "Cuenta", url: "/account", icons: [{ src: "/pwa/icon/192", sizes: "192x192" }] },
    ],
  };
}
