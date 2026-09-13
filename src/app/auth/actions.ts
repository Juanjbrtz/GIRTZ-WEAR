"use server";

import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { getLoginError, getSignupError } from "@/lib/user-errors";

export type AuthActionState = {
  error?: string;
  suggestion?: string;
};

export async function signInWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  if (!isAuthConfigured()) {
    return {
      error: "El acceso a cuentas no está disponible en este momento.",
      suggestion: "Vuelve a intentarlo desde la página principal más tarde.",
    };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return {
      error: "Ingresa correo y contraseña.",
      suggestion: "Revisa que ambos campos estén completos antes de continuar.",
    };
  }

  try {
    const { error } = await auth.signIn.email({ email, password });

    if (error) {
      return getLoginError(error);
    }
  } catch (error) {
    return getLoginError(error);
  }

  redirect("/account");
}

export async function signUpWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  if (!isAuthConfigured()) {
    return { error: "El registro de cuentas no está disponible en este momento." };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    return { error: "Completa nombre, correo y contraseña." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener mínimo 8 caracteres." };
  }

  try {
    const { error } = await auth.signUp.email({ name, email, password });

    if (error) {
      return { error: getSignupError(error) };
    }
  } catch (error) {
    return { error: getSignupError(error) };
  }

  redirect("/account");
}

export async function signOutAccount() {
  if (isAuthConfigured()) {
    try {
      await auth.signOut();
    } catch {
      // El cierre local de la sesión continúa aunque el servicio remoto falle.
    }
  }

  redirect("/");
}
