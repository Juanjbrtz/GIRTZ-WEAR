import type { Metadata } from "next";
import Link from "next/link";
import { CartAutoOpen } from "@/components/cart-auto-open";
import { CatalogClient } from "@/components/catalog-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";
import { getCatalogUpdateSettings } from "@/lib/store-settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora sneakers multimarca en GIRTZ WEAR y confirma disponibilidad por WhatsApp.",
};

type ShopPageProps = {
  searchParams: Promise<{ categoria?: string; marca?: string; carrito?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [{ categoria, marca, carrito }, catalogProducts, catalogUpdate] = await Promise.all([
    searchParams,
    getCatalogProducts(),
    getCatalogUpdateSettings(),
  ]);
  const hasCatalog = catalogProducts.length > 0;

  return (
    <main className="inner-page catalog-page editorial-shop refined-shop">
      {carrito === "1" ? <CartAutoOpen /> : null}
      <SiteHeader />

      {hasCatalog ? (
        <CatalogClient
          products={catalogProducts}
          initialCategory={categoria || "todos"}
          initialBrand={marca || ""}
          noticeMessage={catalogUpdate.forceNotice ? catalogUpdate.message : ""}
        />
      ) : (
        <section className="editorial-empty refined-empty">
          <span>CATÁLOGO EN ACTUALIZACIÓN</span>
          <h2>{catalogUpdate.message}</h2>
          <Link href="/">VOLVER AL INICIO ↗</Link>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
