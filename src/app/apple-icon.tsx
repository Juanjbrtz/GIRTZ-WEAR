import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#f4f3ee",
          border: "4px solid #242424",
          borderRadius: 40,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 42, fontWeight: 800, letterSpacing: "-0.08em" }}>GIRTZ</div>
        <div style={{ display: "flex", marginTop: 7, color: "#8d8d88", fontSize: 9, fontWeight: 700, letterSpacing: "0.28em" }}>WEAR</div>
      </div>
    ),
    size,
  );
}
