"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSqlClient } from "@/db";
import { requireAdmin } from "@/lib/session";
import { DEFAULT_CATALOG_UPDATE_MESSAGE } from "@/lib/store-settings";

function cleanText(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export async function updateCatalogUpdateNotice(formData: FormData) {
  await requireAdmin();

  const forceNotice = formData.get("forceNotice") === "on";
  const message = cleanText(formData.get("catalogUpdateMessage"), 240) || DEFAULT_CATALOG_UPDATE_MESSAGE;
  const sql = getSqlClient();

  await sql.transaction((txn) => [
    txn`INSERT INTO store_settings (key,value,updated_at)
        VALUES ('catalog_update_force',${forceNotice ? "true" : "false"},now())
        ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`,
    txn`INSERT INTO store_settings (key,value,updated_at)
        VALUES ('catalog_update_message',${message},now())
        ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`,
  ]);

  for (const path of ["/", "/shop", "/admin/products"]) revalidatePath(path);
  redirect("/admin/products?catalogNotice=1");
}
