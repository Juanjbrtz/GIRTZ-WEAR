import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { WhatsappConsultButton } from "@/components/whatsapp-consult-button";
import { formatCop, type Product } from "@/data/products";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: Product;
  whatsappNumber: string;
}) {
  return (
    <article className="product-card product-card-v3">
      <Link href={`/product/${product.slug}`} className="product-media product-media-v3">
        <ProductVisual
          product={product}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 25vw"
        />
        <span className="product-audience">{product.audience}</span>
        {product.featured ? <span className="product-featured-badge">DESTACADO</span> : null}
      </Link>

      <div className="product-info product-info-v3">
        <div className="product-heading-row">
          <div>
            <p className="product-kicker">{product.brand}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatCop(product.price)}</strong>
        </div>

        <div className="availability-line">
          <span className="availability-dot" />
          TALLAS · CONSULTAR DISPONIBILIDAD
        </div>

        <div className="product-card-actions-v3">
          <AddToCartButton product={product} className="product-cart-button" />
          <WhatsappConsultButton
            product={product}
            whatsappNumber={whatsappNumber}
            className="product-whatsapp-button"
            label="CONSULTAR POR WHATSAPP"
          />
        </div>

        <Link href={`/product/${product.slug}`} className="product-detail-link-v3">
          VER DETALLES DEL MODELO
        </Link>
      </div>
    </article>
  );
}
