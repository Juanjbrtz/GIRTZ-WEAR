export default function ShopLoading() {
  return (
    <main className="girtz-state-shell" aria-busy="true" aria-live="polite">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ</div>
        <span className="girtz-state-eyebrow">CATÁLOGO</span>
        <h1 className="girtz-state-title">CARGANDO MODELOS.</h1>
        <p className="girtz-state-copy">Estamos preparando las referencias disponibles y sus tallas.</p>
        <div className="girtz-loading-lines" aria-hidden="true"><span /><span /><span /></div>
      </section>
    </main>
  );
}
