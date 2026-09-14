import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { isDatabaseConfigured } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    if (!isDatabaseConfigured()) {
      return Response.json(
        { status: "degraded", database: "not_configured", timestamp: new Date().toISOString() },
        { status: 503, headers: { "cache-control": "no-store" } },
      );
    }

    const db = getDb();
    await db.execute(sql`select 1`);

    return Response.json(
      {
        status: "ok",
        database: "ok",
        latencyMs: Date.now() - startedAt,
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || "local",
        timestamp: new Date().toISOString(),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        status: "degraded",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
