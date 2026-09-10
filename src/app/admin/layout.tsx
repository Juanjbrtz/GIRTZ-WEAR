import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "RESUMEN" },
  { href: "/admin/products", label: "CATÁLOGO" },
  { href: "/admin/inventory", label: "INVENTARIO" },
  { href: "/admin/orders", label: "VENTAS" },
  { href: "/admin/customers", label: "CLIENTES" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { session } = await requireAdmin();

  return (
    <main className="admin-page admin-app-shell">
      <aside className="admin-sidebar">
        <div>
          <Link href="/" className="admin-brand">
            GIRTZ <span>ADMIN</span>
          </Link>
          <p>{session.user.email}</p>
        </div>

        <nav aria-label="Panel administrativo">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/shop">VER TIENDA</Link>
          <Link href="/account">MI CUENTA</Link>
        </div>
      </aside>

      <div className="admin-content">{children}</div>

      <nav className="admin-mobile-nav" aria-label="Navegación de la aplicación">
        {adminNav.slice(0, 4).map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </nav>
    </main>
  );
}
