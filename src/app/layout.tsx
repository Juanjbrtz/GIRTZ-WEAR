import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";
import "./info.css";
import "./account-admin.css";
import "./admin-overrides.css";
import "./storefront-commerce.css";
import "./storefront-v3.css";
import "./storefront-v4.css";
import "./cart-feedback.css";
import "./admin-v2.css";
import "./release-polish.css";

const instrumentSans = Instrument_Sans({ variable: "--font-brand", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "GIRTZ WEAR — Sneakers multimarca", template: "%s | GIRTZ WEAR" },
  description: "Sneakers multimarca. Arma tu selección y confirma disponibilidad y compra directamente por WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={instrumentSans.variable}><body><CartProvider>{children}</CartProvider></body></html>;
}
