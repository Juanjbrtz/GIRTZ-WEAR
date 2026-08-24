import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span>GIRTZ</span>
        <small>WEAR / COLOMBIA</small>
      </div>
      <p>
        Sneakers seleccionados para quienes prefieren dejar marca antes que
        seguirla.
      </p>
      <div className="footer-links">
        <Link href="/shop">SHOP</Link>
        <Link href="/shipping">ENVÍOS</Link>
        <Link href="/returns">CAMBIOS</Link>
        <Link href="/contact">CONTACTO</Link>
      </div>
      <span className="footer-copy">© 2026 GIRTZ WEAR</span>
    </footer>
  );
}
