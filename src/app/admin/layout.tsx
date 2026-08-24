import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "RESUMEN" },
  { href: "/admin/orders", label: "PEDIDOS" },
  { href: "/admin/customers", label: "CLIENTES" },
  { href: "/admin/products", label: "PRODUCTOS" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { session } = await requireAdmin();

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <Link href="/" className="admin-brand">
            GIRTZ <span>ADMIN</span>
          </Link>
          <p>{session.user.email}</p>
        </div>

        <nav aria-label="Panel administrativo">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/shop">VER TIENDA</Link>
          <Link href="/account">MI CUENTA</Link>
        </div>
      </aside>

      <div className="admin-content">{children}</div>
    </main>
  );
}
