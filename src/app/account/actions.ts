"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { customers } from "@/db/schema";
import { requireAccount } from "@/lib/session";

function clean(value: FormDataEntryValue | null, max = 180) {
  return String(value || "").trim().slice(0, max);
}

export async function updateAccountProfile(formData: FormData) {
  const { customer } = await requireAccount();
  if (!customer) redirect("/account?profileError=profile#configuracion");

  const name = clean(formData.get("name"), 120);
  const phone = clean(formData.get("phone"), 40);
  const address = clean(formData.get("address"), 180);
  const city = clean(formData.get("city"), 100);

  if (!name) redirect("/account?profileError=name#configuracion");

  try {
    await getDb().update(customers).set({
      name,
      phone: phone || null,
      address: address || null,
      city: city || null,
      updatedAt: new Date(),
    }).where(eq(customers.id, customer.id));
  } catch {
    redirect("/account?profileError=save#configuracion");
  }

  revalidatePath("/account");
  redirect("/account?profile=1#configuracion");
}
