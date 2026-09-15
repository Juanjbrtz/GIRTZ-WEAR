export default function ProductLoading() {
  return (
    <main className="girtz-state-shell" aria-busy="true" aria-live="polite">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ</div>
        <span className="girtz-state-eyebrow">PRODUCTO</span>
        <h1 className="girtz-state-title">CARGANDO MODELO.</h1>
        <p className="girtz-state-copy">Estamos consultando la información más reciente de esta referencia.</p>
        <div className="girtz-loading-lines" aria-hidden="true"><span /><span /><span /></div>
      </section>
    </main>
  );
}
