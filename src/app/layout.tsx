import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { PwaRegister } from "@/components/pwa-register";
import { getWhatsappNumber } from "@/lib/store-settings";
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
import "./ios-ui-preview.css";
import "./editorial-preview.css";
import "./product-editorial-preview.css";
import "./catalog-refinement.css";
import "./dark-refined-preview.css";
import "./cart-drawer-refined.css";
import "./cart-drawer-polish.css";
import "./premium-flow-v2.css";
import "./nav-legibility-polish.css";
import "./error-feedback.css";
import "./admin-product-danger.css";
import "./admin-mobile-polish.css";
import "./experience-states.css";
import "./size-flow.css";
import "./admin-mobile-app.css";
import "./password-security.css";
import "./responsive-universal.css";
import "./catalog-account-polish.css";
import "./brand-logo.css";
import "./admin-size-upload.css";

const instrumentSans = Instrument_Sans({ variable: "--font-brand", subsets: ["latin"] });
const siteUrl = "https://girtzwear.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "GIRTZ Wear",
  title: { default: "GIRTZ WEAR — Sneakers multimarca", template: "%s | GIRTZ WEAR" },
  description: "Sneakers multimarca. Arma tu selección y confirma disponibilidad y compra directamente por WhatsApp.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "GIRTZ Wear",
    title: "GIRTZ WEAR — Sneakers multimarca",
    description: "Explora el catálogo y confirma talla, disponibilidad y envío por WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GIRTZ WEAR — Sneakers multimarca",
    description: "Explora el catálogo y confirma talla, disponibilidad y envío por WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GIRTZ Wear",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/pwa/icon/192", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon/512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa/icon/180", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <html lang="es" className={instrumentSans.variable}>
      <body>
        <PwaRegister />
        <CartProvider>
          {children}
          <CartDrawer whatsappNumber={whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}
