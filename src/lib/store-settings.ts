import { getSqlClient } from "@/db";
import { isDatabaseConfigured } from "@/lib/store-data";

export async function getWhatsappNumber() {
  if (!isDatabaseConfigured()) return "";

  try {
    const sql = getSqlClient();
    const rows = await sql`
      SELECT value
      FROM store_settings
      WHERE key = 'whatsapp_number'
      LIMIT 1
    `;

    return String(rows[0]?.value || "").replace(/\D/g, "");
  } catch {
    return "";
  }
}
