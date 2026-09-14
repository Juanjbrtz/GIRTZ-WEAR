"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: "100vh", background: "#050505", color: "#f2f1ec", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(620px, 100%)", padding: 32, border: "1px solid #242424", borderRadius: 26, background: "#0c0c0c" }}>
            <span style={{ color: "#888883", fontSize: 10, fontWeight: 700, letterSpacing: ".15em" }}>GIRTZ WEAR / ERROR</span>
            <h1 style={{ margin: "16px 0 0", fontSize: "clamp(36px, 9vw, 58px)", lineHeight: .98, letterSpacing: "-.05em" }}>No pudimos abrir GIRTZ.</h1>
            <p style={{ margin: "20px 0 0", color: "#aaa9a3", fontSize: 14, lineHeight: 1.65 }}>Intenta nuevamente. Si continúa, cierra la app y vuelve a abrirla.</p>
            <button type="button" onClick={reset} style={{ minHeight: 48, marginTop: 26, padding: "0 18px", border: 0, borderRadius: 15, background: "#f1f0eb", color: "#080808", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>REINTENTAR</button>
          </section>
        </main>
      </body>
    </html>
  );
}
