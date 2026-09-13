"use server";

import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { getLoginError, getSignupError } from "@/lib/user-errors";

export type AuthActionState = {
  error?: string;
  suggestion?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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

  if (!email) {
    return {
      error: "Ingresa tu correo.",
      suggestion: "Escribe el correo con el que registraste tu cuenta.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "El correo no tiene un formato válido.",
      suggestion: "Revisa que esté escrito completo, por ejemplo nombre@correo.com.",
    };
  }

  if (!password) {
    return {
      error: "Ingresa tu contraseña.",
      suggestion: "Escribe la contraseña de tu cuenta e inténtalo de nuevo.",
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

  if (!name) {
    return { error: "Ingresa tu nombre." };
  }

  if (!email) {
    return { error: "Ingresa tu correo." };
  }

  if (!isValidEmail(email)) {
    return { error: "Ingresa un correo válido." };
  }

  if (!password) {
    return { error: "Crea una contraseña." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener mínimo 8 caracteres." };
  }

  if (password.length > 128) {
    return { error: "La contraseña es demasiado larga." };
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
