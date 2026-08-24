import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { ensureCustomerForUser, isDatabaseConfigured } from "@/lib/store-data";

export async function getSessionAccount() {
  if (!isAuthConfigured()) {
    return {
      configured: false as const,
      session: null,
      customer: null,
    };
  }

  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return {
      configured: true as const,
      session: null,
      customer: null,
    };
  }

  const customer = isDatabaseConfigured()
    ? await ensureCustomerForUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      })
    : null;

  return {
    configured: true as const,
    session,
    customer,
  };
}

export async function requireAccount() {
  const account = await getSessionAccount();

  if (!account.configured || !account.session?.user) {
    redirect("/auth/sign-in");
  }

  return account;
}

export async function requireAdmin() {
  const account = await requireAccount();

  if (!account.customer || account.customer.role !== "admin") {
    redirect("/account?admin=denied");
  }

  return account;
}
