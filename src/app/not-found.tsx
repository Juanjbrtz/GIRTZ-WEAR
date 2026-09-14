import Link from "next/link";
import "./ux-states.css";

export default function NotFound() {
  return (
    <main className="ux-state-shell">
      <section className="ux-state-card">
        <span>GIRTZ WEAR / 404</span>
        <h1>Esta página no existe.</h1>
        <p>Puede que el enlace haya cambiado o que el producto ya no esté disponible.</p>
        <div className="ux-state-actions">
          <Link href="/shop" className="primary">VER CATÁLOGO</Link>
          <Link href="/">IR AL INICIO</Link>
        </div>
      </section>
    </main>
  );
}
