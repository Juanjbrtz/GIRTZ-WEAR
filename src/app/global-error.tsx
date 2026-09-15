"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: "100vh", background: "#050505", color: "#f3f2ed", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <main className="girtz-state-shell" role="alert">
          <section className="girtz-state-card">
            <div className="girtz-state-brand">GIRTZ</div>
            <span className="girtz-state-eyebrow">ERROR GENERAL</span>
            <h1 className="girtz-state-title">NO PUDIMOS ABRIR GIRTZ.</h1>
            <p className="girtz-state-copy">Intenta nuevamente. Si el problema continúa, cierra la app o el navegador y vuelve a abrir GIRTZ.</p>
            <div className="girtz-state-actions">
              <button type="button" className="girtz-state-button" onClick={() => reset()}>REINTENTAR</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
