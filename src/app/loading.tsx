export default function Loading() {
  return (
    <main className="girtz-state-shell" aria-busy="true" aria-live="polite">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ</div>
        <span className="girtz-state-eyebrow">CARGANDO</span>
        <h1 className="girtz-state-title">PREPARANDO LA EXPERIENCIA.</h1>
        <p className="girtz-state-copy">Estamos cargando la información más reciente de la tienda.</p>
        <div className="girtz-loading-lines" aria-hidden="true"><span /><span /><span /></div>
      </section>
    </main>
  );
}
