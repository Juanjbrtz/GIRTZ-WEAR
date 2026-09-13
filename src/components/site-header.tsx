import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { CartLink } from "@/components/cart-link";
import { MobileDock } from "@/components/mobile-dock";
import { getSessionAccount } from "@/lib/session";

const navItems = [
  { href: "/shop", label: "CATÁLOGO" },
  { href: "/shop?categoria=hombre", label: "HOMBRE" },
  { href: "/shop?categoria=mujer", label: "MUJER" },
  { href: "/shop?categoria=unisex", label: "UNISEX" },
];

export async function SiteHeader() {
  const account = await getSessionAccount();
  const signedIn = Boolean(account.session?.user);
  const displayName = account.customer?.name || account.session?.user?.name || account.session?.user?.email || null;

  return (
    <>
      <header className="site-header site-header-v3 site-header-final">
        <Link href="/" className="brand-mark brand-mark-final" aria-label="GIRTZ WEAR, inicio">
          <span>GIRTZ</span>
        </Link>

        <nav className="main-nav main-nav-v3" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="header-actions header-actions-v3 header-actions-final">
          <CartLink compact />
          <AccountMenu signedIn={signedIn} isAdmin={account.isAdmin} name={displayName} />
        </div>
      </header>
      <MobileDock />
    </>
  );
}
