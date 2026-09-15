import { getSqlClient } from "@/db";
import { isDatabaseConfigured } from "@/lib/store-data";

export const DEFAULT_CATALOG_UPDATE_MESSAGE = "Estamos preparando nuevas referencias. Puedes volver pronto para ver los modelos disponibles.";

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

export async function getCatalogUpdateSettings() {
  const fallback = {
    forceNotice: false,
    message: DEFAULT_CATALOG_UPDATE_MESSAGE,
  };

  if (!isDatabaseConfigured()) return fallback;

  try {
    const sql = getSqlClient();
    const rows = await sql`
      SELECT key, value
      FROM store_settings
      WHERE key IN ('catalog_update_force', 'catalog_update_message')
    `;

    const settings = new Map(rows.map((row) => [String(row.key), String(row.value || "")]));
    const forceValue = (settings.get("catalog_update_force") || "").toLowerCase();
    const message = (settings.get("catalog_update_message") || "").trim();

    return {
      forceNotice: ["1", "true", "on", "yes"].includes(forceValue),
      message: message || DEFAULT_CATALOG_UPDATE_MESSAGE,
    };
  } catch {
    return fallback;
  }
}
