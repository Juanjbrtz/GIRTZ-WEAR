import type { ReactNode } from "react";
import Link from "next/link";
import { AdminMobileDock } from "@/components/admin-mobile-dock";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "RESUMEN" },
  { href: "/admin/products", label: "PRODUCTOS" },
  { href: "/admin/inventory", label: "INVENTARIO / COSTOS" },
  { href: "/admin/sales", label: "VENTAS / UTILIDAD" },
  { href: "/admin/providers", label: "PROVEEDORES" },
  { href: "/admin/orders", label: "PEDIDOS" },
  { href: "/admin/customers", label: "CLIENTES" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { session } = await requireAdmin();
  return (
    <main className="admin-page admin-page-final">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <Link href="/" className="admin-brand">GIRTZ <span>ADMIN</span></Link>
          <p>{session.user.email}</p>
        </div>
        <nav aria-label="Panel administrativo">{adminNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="admin-sidebar-bottom"><Link href="/shop">VER TIENDA</Link><Link href="/account">MI CUENTA</Link></div>
      </aside>
      <div className="admin-content">{children}</div>
      <AdminMobileDock />
    </main>
  );
}
