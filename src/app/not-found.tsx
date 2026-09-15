import Link from "next/link";

export default function NotFound() {
  return (
    <main className="girtz-state-shell">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ</div>
        <span className="girtz-state-eyebrow">PÁGINA NO ENCONTRADA / 404</span>
        <h1 className="girtz-state-title">ESTA PÁGINA NO EXISTE.</h1>
        <p className="girtz-state-copy">Puede que el enlace haya cambiado o que el producto ya no esté disponible.</p>
        <div className="girtz-state-actions">
          <Link className="girtz-state-button" href="/shop">VER CATÁLOGO</Link>
          <Link className="girtz-state-button secondary" href="/">IR AL INICIO</Link>
        </div>
      </section>
    </main>
  );
}
