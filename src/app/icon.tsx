import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          border: "9px solid #242424",
          borderRadius: 112,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 104, fontWeight: 800, letterSpacing: "-0.07em" }}>GIRTZ</div>
        <div style={{ display: "flex", marginTop: 18, color: "#8d8d88", fontSize: 24, fontWeight: 700, letterSpacing: "0.28em" }}>WEAR</div>
      </div>
    ),
    size,
  );
}
