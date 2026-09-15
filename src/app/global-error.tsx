"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: "100vh", background: "#050505", color: "#f3f2ed", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px 22px 32px", background: "#050505", color: "#f3f2ed" }} role="alert">
          <section style={{ width: "min(560px, 100%)", padding: 30, border: "1px solid rgba(255,255,255,.10)", borderRadius: 28, background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.012))" }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.065em" }}>GIRTZ</div>
            <span style={{ display: "block", marginTop: 42, color: "#858580", fontSize: 9, fontWeight: 750, letterSpacing: ".16em" }}>ERROR GENERAL</span>
            <h1 style={{ margin: "13px 0 0", maxWidth: 460, fontSize: "clamp(34px, 8vw, 54px)", fontWeight: 520, lineHeight: .96, letterSpacing: "-.055em" }}>NO PUDIMOS ABRIR GIRTZ.</h1>
            <p style={{ margin: "18px 0 0", maxWidth: 460, color: "#aaa9a3", fontSize: 13, lineHeight: 1.65 }}>Intenta nuevamente. Si el problema continúa, cierra la app o el navegador y vuelve a abrir GIRTZ.</p>
            <button type="button" onClick={() => reset()} style={{ minHeight: 46, marginTop: 24, padding: "0 17px", border: "1px solid #f0efea", borderRadius: 15, background: "#f0efea", color: "#080808", fontSize: 10, fontWeight: 800, letterSpacing: ".11em", cursor: "pointer" }}>REINTENTAR</button>
          </section>
        </main>
      </body>
    </html>
  );
}
