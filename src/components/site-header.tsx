import Link from "next/link";

const navItems = [
  { href: "/shop", label: "SHOP" },
  { href: "/#drop", label: "DROP 001" },
  { href: "/#about", label: "NOSOTROS" },
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

      <Link href="/shop" className="header-cta">
        VER DROP <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
