"use server";

import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";

export type AuthActionState = {
  error?: string;
};

export async function signInWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  if (!isAuthConfigured()) {
    return { error: "La autenticación todavía no está configurada en producción." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Ingresa correo y contraseña." };
  }

  const { error } = await auth.signIn.email({ email, password });

  if (error) {
    return { error: error.message || "No fue posible iniciar sesión." };
  }

  redirect("/account");
}

export async function signUpWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  if (!isAuthConfigured()) {
    return { error: "La autenticación todavía no está configurada en producción." };
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

  const { error } = await auth.signUp.email({ name, email, password });

  if (error) {
    return { error: error.message || "No fue posible crear la cuenta." };
  }

  redirect("/account");
}

export async function signOutAccount() {
  if (isAuthConfigured()) {
    await auth.signOut();
  }

  redirect("/");
}
