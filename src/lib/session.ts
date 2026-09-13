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

function signedOutAccount(configured: boolean) {
  return {
    configured,
    session: null,
    customer: null,
    isAdmin: false,
  } as const;
}

export async function getSessionAccount() {
  if (!isAuthConfigured()) {
    return signedOutAccount(false);
  }

  let session = null;

  try {
    const response = await auth.getSession();
    session = response.data;
  } catch {
    // Una falla temporal del proveedor de autenticación no debe tumbar las páginas públicas.
    return signedOutAccount(true);
  }

  if (!session?.user) {
    return signedOutAccount(true);
  }

  const authRole = readAuthRole(session.user);
  let customer = null;

  if (isDatabaseConfigured()) {
    try {
      customer = await ensureCustomerForUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: authRole.available ? (authRole.isAdmin ? "admin" : "customer") : undefined,
      });
    } catch {
      // El catálogo y la navegación siguen disponibles aunque falle temporalmente la sincronización del perfil.
      customer = null;
    }
  }

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
