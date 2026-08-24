import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explora el primer drop de sneakers seleccionados por GIRTZ WEAR.",
};

export default function ShopPage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="shop-shell">
        <div className="shop-heading">
          <div>
            <span className="section-index">GIRTZ WEAR / DROP 001</span>
            <h1>SHOP</h1>
          </div>
          <p>
            Primera selección de referencias. El catálogo, disponibilidad y
            precios actuales son datos de muestra mientras conectamos el
            inventario real.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
