import { readFile } from "node:fs/promises";
import path from "node:path";
import hombreC1Part1 from "@/server/catalog-images-q25/hombre/chunk-01";
import hombreC1Part2 from "@/server/catalog-images-q25/hombre/chunk-02";
import hombreC1Part3 from "@/server/catalog-images-q25/hombre/chunk-03";
import hombreC1Part4 from "@/server/catalog-images-q25/hombre/chunk-04";

export const runtime = "nodejs";

const fileCatalogs: Record<string, string[]> = {
  "mujer-c1": [
    "src/server/catalog-atlas-v3/mujer-c1/chunk-01.b64",
    "src/server/catalog-atlas-v3/mujer-c1/chunk-02.b64",
  ],
  "unisex-c1": [
    "public/catalog-data/unisex-c1/part-01.b64",
    "public/catalog-data/unisex-c1/part-02.b64",
    "public/catalog-data/unisex-c1/part-03.b64",
    "public/catalog-data/unisex-c1/part-04.b64",
  ],
  "hombre-c2": [
    "src/server/catalog-atlas-v3/hombre-c2/chunk-01.b64",
    "src/server/catalog-atlas-v3/hombre-c2/chunk-02.b64",
  ],
  "mujer-c2": [
    "src/server/catalog-atlas-v3/mujer-c2/chunk-01.b64",
  ],
  "unisex-c2": ["public/catalog/unisex-c2.b64"],
};

async function readEncodedCatalog(files: string[]) {
  const parts = await Promise.all(
    files.map((file) => readFile(path.join(process.cwd(), file), "utf8")),
  );

  return Buffer.from(parts.map((part) => part.trim()).join(""), "base64");
}

async function getCatalogAsset(key: string) {
  if (key === "hombre-c1") {
    return Buffer.from(
      `${hombreC1Part1}${hombreC1Part2}${hombreC1Part3}${hombreC1Part4}`,
      "base64",
    );
  }

  const files = fileCatalogs[key];
  if (!files) return null;

  return readEncodedCatalog(files);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const bytes = await getCatalogAsset(key);

  if (!bytes) {
    return new Response("Catálogo no encontrado", { status: 404 });
  }

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "image/avif",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Girtz-Catalog-Source": "real",
    },
  });
}
