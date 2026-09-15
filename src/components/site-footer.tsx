import Link from "next/link";
import { BrandWordmark } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BrandWordmark className="girtz-wordmark--footer" />
        <small>WEAR / COLOMBIA</small>
      </div>

      <p>
        Catálogo multimarca de sneakers seleccionado para una compra clara,
        directa y acompañada.
      </p>

      <div className="footer-links">
        <Link href="/shop">CATÁLOGO</Link>
        <Link href="/shop?categoria=hombre">HOMBRE</Link>
        <Link href="/shop?categoria=mujer">MUJER</Link>
        <Link href="/shop?categoria=unisex">UNISEX</Link>
        <Link href="/account">MI CUENTA</Link>
      </div>

      <div className="footer-links secondary">
        <Link href="/contact">CONTACTO</Link>
        <Link href="/shipping">ENVÍOS</Link>
        <Link href="/returns">CAMBIOS</Link>
        <span className="footer-copy">© 2026 GIRTZ WEAR</span>
      </div>
    </footer>
  );
}
