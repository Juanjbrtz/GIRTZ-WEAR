import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return connectionString;
}

export function getSqlClient() {
  return neon(getConnectionString());
}

export function getDb() {
  const sql = getSqlClient();
  return drizzle({ client: sql, schema });
}
