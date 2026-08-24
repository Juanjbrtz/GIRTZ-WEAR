import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function InfoPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="info-shell">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <div className="info-copy">{children}</div>
      </section>
      <SiteFooter />
    </main>
  );
}
