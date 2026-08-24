import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import "./info.css";
import "./account-admin.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GIRTZ WEAR — Catálogo premium de sneakers",
    template: "%s | GIRTZ WEAR",
  },
  description:
    "Catálogo multimarca de sneakers para hombre, mujer y unisex en Colombia. Selección curada, tallas visibles y atención directa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={instrumentSans.variable}>
      <body>{children}</body>
    </html>
  );
}
