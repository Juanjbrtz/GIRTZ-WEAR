import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { ensureCustomerForUser, isDatabaseConfigured } from "@/lib/store-data";

type SessionUserWithRole = {
  role?: string | string[] | null;
};

function readAuthRole(user: unknown) {
  if (!user || typeof user !== "object") {
    return { available: false, isAdmin: false };
  }

  const hasRole = Object.prototype.hasOwnProperty.call(user, "role");
  const role = (user as SessionUserWithRole).role;

  if (!hasRole) {
    return { available: false, isAdmin: false };
  }

  if (Array.isArray(role)) {
    return { available: true, isAdmin: role.includes("admin") };
  }

  if (typeof role === "string") {
    const roles = role
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    return { available: true, isAdmin: roles.includes("admin") };
  }

  return { available: true, isAdmin: false };
}

export async function getSessionAccount() {
  if (!isAuthConfigured()) {
    return {
      configured: false as const,
      session: null,
      customer: null,
      isAdmin: false,
    };
  }

  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return {
      configured: true as const,
      session: null,
      customer: null,
      isAdmin: false,
    };
  }

  const authRole = readAuthRole(session.user);
  const customer = isDatabaseConfigured()
    ? await ensureCustomerForUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: authRole.available ? (authRole.isAdmin ? "admin" : "customer") : undefined,
      })
    : null;

  const isAdmin = authRole.available
    ? authRole.isAdmin
    : customer?.role === "admin";

  return {
    configured: true as const,
    session,
    customer,
    isAdmin,
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

  if (!account.isAdmin) {
    redirect("/account?admin=denied");
  }

  return account;
}
