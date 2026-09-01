import { readFile } from "node:fs/promises";
import path from "node:path";
import hombreC1Part1 from "@/server/catalog-images-q25/hombre/chunk-01";
import hombreC1Part2 from "@/server/catalog-images-q25/hombre/chunk-02";
import hombreC1Part3 from "@/server/catalog-images-q25/hombre/chunk-03";
import hombreC1Part4 from "@/server/catalog-images-q25/hombre/chunk-04";

export const runtime = "nodejs";

const transparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="#101010"/></svg>`;

async function getCatalogAsset(key: string) {
  if (key === "hombre-c1") {
    return {
      bytes: Buffer.from(
        `${hombreC1Part1}${hombreC1Part2}${hombreC1Part3}${hombreC1Part4}`,
        "base64",
      ),
      type: "image/avif",
      source: "real",
    };
  }

  if (key === "unisex-c2") {
    try {
      const encoded = await readFile(
        path.join(process.cwd(), "public", "catalog", "unisex-c2.b64"),
        "utf8",
      );
      return {
        bytes: Buffer.from(encoded.trim(), "base64"),
        type: "image/avif",
        source: "real",
      };
    } catch {
      // Continúa al placeholder visual seguro.
    }
  }

  return {
    bytes: Buffer.from(transparentSvg),
    type: "image/svg+xml",
    source: "pending",
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const asset = await getCatalogAsset(key);

  return new Response(new Uint8Array(asset.bytes), {
    headers: {
      "Content-Type": asset.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Girtz-Catalog-Source": asset.source,
    },
  });
}
