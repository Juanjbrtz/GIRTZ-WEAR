import { ImageResponse } from "next/og";

export const alt = "GIRTZ Wear — Sneakers multimarca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 78px",
          background: "linear-gradient(145deg, #050505 0%, #111111 100%)",
          color: "#f3f2ed",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "18px" }}>
          <span style={{ fontSize: 58, fontWeight: 800, letterSpacing: "-0.07em" }}>GIRTZ</span>
          <span style={{ color: "#8b8b86", fontSize: 18, fontWeight: 700, letterSpacing: "0.22em" }}>WEAR</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <span style={{ color: "#8d8d88", fontSize: 20, fontWeight: 700, letterSpacing: "0.16em" }}>SNEAKERS MULTIMARCA</span>
          <div style={{ marginTop: 20, fontSize: 88, fontWeight: 700, lineHeight: 0.94, letterSpacing: "-0.055em" }}>
            ENCUENTRA TU PRÓXIMO PAR.
          </div>
          <div style={{ marginTop: 30, color: "#aaa9a4", fontSize: 24, lineHeight: 1.4 }}>
            Explora el catálogo y confirma talla, disponibilidad y envío por WhatsApp.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
