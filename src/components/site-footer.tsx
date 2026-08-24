import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span>GIRTZ</span>
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
