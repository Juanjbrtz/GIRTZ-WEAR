import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatCop, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="product-page">
        <div className="product-detail-media">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 58vw"
          />
        </div>

        <div className="product-detail">
          <span>{product.eyebrow} / GIRTZ SELECTED</span>
          <h1>{product.name}</h1>
          <div className="product-price">{formatCop(product.price)}</div>
          <p className="product-description">{product.description}</p>

          <div className="size-block">
            <span>SELECCIONA TU TALLA</span>
            <div className="size-grid" aria-label="Tallas disponibles de muestra">
              {product.sizes.map((size) => (
                <span key={size}>{size}</span>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <Link href="/contact" className="primary-button">
              COMPRAR POR WHATSAPP <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="product-note">
            Referencia, precio y disponibilidad de muestra. Se reemplazarán al
            conectar el catálogo real y el checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
