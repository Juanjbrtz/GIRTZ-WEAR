"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Resumen", icon: "home" },
  { href: "/admin/products", label: "Productos", icon: "grid" },
  { href: "/admin/inventory", label: "Inventario", icon: "box" },
  { href: "/admin/sales", label: "Ventas", icon: "chart" },
  { href: "/admin/orders", label: "Pedidos", icon: "bag" },
] as const;

function Icon({ name }: { name: (typeof items)[number]["icon"] }) {
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 10.4 12 4l7.5 6.4v8.7h-5v-5.2h-5v5.2h-5v-8.7Z" /></svg>;
  if (name === "grid") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
  if (name === "box") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 7.2 12 3.5l7.5 3.7v9.6L12 20.5l-7.5-3.7V7.2Z"/><path d="m4.8 7.4 7.2 3.5 7.2-3.5M12 10.9v9.2"/></svg>;
  if (name === "chart") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V11M12 19V5M19 19v-9"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 8.2h10.4l.8 11H6l.8-11Z"/><path d="M9 8.2V6.5a3 3 0 0 1 6 0v1.7"/></svg>;
}

export function AdminMobileDock() {
  const pathname = usePathname();

  return (
    <nav className="admin-mobile-dock" aria-label="Navegación rápida del panel administrativo">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
