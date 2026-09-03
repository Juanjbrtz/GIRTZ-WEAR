import { getSqlClient } from "@/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const sql = getSqlClient();
    const rows = await sql`
      SELECT content_type, encode(image_data, 'base64') AS image_base64
      FROM product_images
      WHERE product_id = ${id}::uuid
      LIMIT 1
    `;

    const row = rows[0];
    if (!row?.image_base64) {
      return new Response("Imagen no encontrada", { status: 404 });
    }

    const bytes = Buffer.from(String(row.image_base64), "base64");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": String(row.content_type || "image/jpeg"),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Imagen no disponible", { status: 404 });
  }
}
