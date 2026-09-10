import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";
import "./info.css";
import "./account-admin.css";
import "./admin-overrides.css";
import "./storefront-commerce.css";
import "./storefront-v3.css";
import "./admin-v2.css";
import "./commerce-v2.css";
import "./commerce-v2-extra.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GIRTZ WEAR — Sneakers",
    template: "%s | GIRTZ WEAR",
  },
  description:
    "Tienda de sneakers GIRTZ WEAR. Explora modelos, tallas disponibles, compra en línea y recibe tu pedido.",
  applicationName: "GIRTZ WEAR",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GIRTZ WEAR",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={instrumentSans.variable}>
      <body>
        <PwaRegister />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
