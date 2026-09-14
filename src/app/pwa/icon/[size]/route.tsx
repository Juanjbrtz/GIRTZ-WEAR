import { ImageResponse } from "next/og";

const ALLOWED_SIZES = new Set([180, 192, 512]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: rawSize } = await params;
  const size = Number(rawSize);

  if (!ALLOWED_SIZES.has(size)) {
    return new Response("Not found", { status: 404 });
  }

  const compact = size < 300;

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
          border: `${Math.max(2, Math.round(size * 0.018))}px solid #242424`,
          borderRadius: Math.round(size * 0.22),
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: compact ? Math.round(size * 0.23) : Math.round(size * 0.20),
            fontWeight: 800,
            letterSpacing: compact ? "-0.08em" : "-0.07em",
            lineHeight: 1,
          }}
        >
          GIRTZ
        </div>
        <div
          style={{
            display: "flex",
            marginTop: Math.round(size * 0.035),
            color: "#8d8d88",
            fontSize: Math.round(size * 0.045),
            fontWeight: 700,
            letterSpacing: "0.28em",
          }}
        >
          WEAR
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
