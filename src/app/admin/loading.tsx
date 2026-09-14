export default function AdminLoading() {
  return (
    <main className="girtz-state-shell" aria-busy="true" aria-live="polite">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ <span style={{fontSize:"11px",letterSpacing:".14em",color:"#888"}}>ADMIN</span></div>
        <span className="girtz-state-eyebrow">ACTUALIZANDO PANEL</span>
        <h1 className="girtz-state-title">CARGANDO DATOS.</h1>
        <p className="girtz-state-copy">Estamos consultando la información más reciente de productos, pedidos y clientes.</p>
        <div className="girtz-loading-lines" aria-hidden="true"><span /><span /><span /></div>
      </section>
    </main>
  );
}
