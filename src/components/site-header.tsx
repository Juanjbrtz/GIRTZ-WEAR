import Link from "next/link";
import { CartLink } from "@/components/cart-link";

const navItems = [
  { href: "/shop", label: "CATÁLOGO" },
  { href: "/shop?categoria=hombre", label: "HOMBRE" },
  { href: "/shop?categoria=mujer", label: "MUJER" },
  { href: "/shop?categoria=unisex", label: "UNISEX" },
];

export function SiteHeader() {
  return (
    <header className="site-header site-header-v3">
      <Link href="/" className="brand-mark" aria-label="GIRTZ WEAR, inicio">
        <span>GIRTZ</span>
        <small>WEAR</small>
      </Link>

      <nav className="main-nav main-nav-v3" aria-label="Navegación principal">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions header-actions-v3">
        <CartLink compact />
        <Link href="/account" className="header-cta">
          CUENTA
        </Link>
      </div>
    </header>
  );
}
