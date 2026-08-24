import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatCop } from "@/data/products";
import { getCatalogProductBySlug } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.brand} ${product.name}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="inner-page product-inner-page">
      <SiteHeader />

      <section className="product-page">
        <div className="product-detail-media">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            unoptimized
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <span className="product-detail-category">{product.audience}</span>
        </div>

        <div className="product-detail">
          <div className="product-detail-topline">
            <span>{product.brand.toUpperCase()} / MULTIMARCA</span>
            <Link href="/shop">VOLVER AL CATÁLOGO</Link>
          </div>

          <h1>{product.name}</h1>
          <div className="product-price">{formatCop(product.price)}</div>
          <p className="product-description">{product.description}</p>

          <div className="product-divider" />

          <div className="size-block">
            <div className="size-title-row">
              <span>TALLAS DISPONIBLES</span>
              <small>Selecciona la referencia al consultar disponibilidad.</small>
            </div>
            <div className="size-grid" aria-label={`Tallas disponibles para ${product.name}`}>
              {product.sizes.length ? (
                product.sizes.map((size) => <span key={size}>{size}</span>)
              ) : (
                <small>Consulta disponibilidad de talla.</small>
              )}
            </div>
          </div>

          <div className="product-actions">
            <Link href="/contact" className="primary-button">
              CONSULTAR DISPONIBILIDAD
            </Link>
            <Link href="/shipping" className="secondary-button">
              INFORMACIÓN DE ENVÍO
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
