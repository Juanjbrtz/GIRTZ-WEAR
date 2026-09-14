"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="girtz-state-shell" role="alert">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ <span style={{fontSize:"11px",letterSpacing:".14em",color:"#888"}}>ADMIN</span></div>
        <span className="girtz-state-eyebrow">PANEL ADMINISTRATIVO</span>
        <h1 className="girtz-state-title">NO PUDIMOS CARGAR LOS DATOS.</h1>
        <p className="girtz-state-copy">La información administrativa no se modificó. Puedes intentar cargarla nuevamente.</p>
        <div className="girtz-state-actions">
          <button type="button" className="girtz-state-button" onClick={() => reset()}>REINTENTAR</button>
          <a className="girtz-state-button secondary" href="/account">VOLVER A MI CUENTA</a>
        </div>
      </section>
    </main>
  );
}
