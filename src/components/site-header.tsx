import Link from "next/link";

const navItems = [
  { href: "/", label: "INICIO" },
  { href: "/shop?categoria=hombre", label: "HOMBRE" },
  { href: "/shop?categoria=mujer", label: "MUJER" },
  { href: "/shop?categoria=unisex", label: "UNISEX" },
  { href: "/account", label: "CUENTA" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-mark" aria-label="GIRTZ WEAR, inicio">
        <span>GIRTZ</span>
        <small>WEAR</small>
      </Link>

      <nav className="main-nav" aria-label="Navegación principal">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/account" className="header-cta">
        MI CUENTA
      </Link>
    </header>
  );
}
