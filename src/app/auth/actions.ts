"use server";

import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { getLoginError, getSignupError } from "@/lib/user-errors";

export type AuthField = "name" | "email" | "password" | "confirmPassword";

export type AuthActionState = {
  error?: string;
  suggestion?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
  errorField?: AuthField;
  values?: {
    name?: string;
    email?: string;
  };
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isWeakPassword(value: string) {
  const hasLetter = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value);
  const hasNumber = /\d/.test(value);
  const repeatedCharacter = /^(.)\1+$/.test(value);
  const commonPasswords = new Set([
    "password1",
    "password123",
    "contraseña1",
    "contrasena1",
    "qwerty123",
    "12345678a",
    "abcdefg1",
  ]);

  return !hasLetter || !hasNumber || repeatedCharacter || commonPasswords.has(value.toLowerCase());
}

function signupFieldError(
  field: AuthField,
  message: string,
  values: { name: string; email: string },
): AuthActionState {
  return {
    fieldErrors: { [field]: message },
    errorField: field,
    values,
  };
}

export async function signInWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const values = { email };

  if (!isAuthConfigured()) {
    return {
      error: "El acceso a cuentas no está disponible en este momento.",
      suggestion: "Vuelve a intentarlo desde la página principal más tarde.",
      values,
    };
  }

  if (!email) {
    return {
      error: "Ingresa tu correo.",
      suggestion: "Escribe el correo con el que registraste tu cuenta.",
      values,
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "El correo no tiene un formato válido.",
      suggestion: "Revisa que esté escrito completo, por ejemplo nombre@correo.com.",
      values,
    };
  }

  if (!password) {
    return {
      error: "Ingresa tu contraseña.",
      suggestion: "Escribe la contraseña de tu cuenta e inténtalo de nuevo.",
      values,
    };
  }

  try {
    const { error } = await auth.signIn.email({ email, password });

    if (error) {
      const friendly = getLoginError(error);
      return { error: friendly.message, suggestion: friendly.suggestion, values };
    }
  } catch (error) {
    const friendly = getLoginError(error);
    return { error: friendly.message, suggestion: friendly.suggestion, values };
  }

  redirect("/account");
}

export async function signUpWithEmail(
  _previousState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState | null> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const values = { name, email };

  if (!isAuthConfigured()) {
    return { error: "El registro de cuentas no está disponible en este momento.", values };
  }

  if (!name) {
    return signupFieldError("name", "Ingresa tu nombre.", values);
  }

  if (!email) {
    return signupFieldError("email", "Ingresa tu correo.", values);
  }

  if (!isValidEmail(email)) {
    return signupFieldError("email", "Ingresa un correo válido.", values);
  }

  if (!password) {
    return signupFieldError("password", "Crea una contraseña.", values);
  }

  if (!confirmPassword) {
    return signupFieldError("confirmPassword", "Confirma tu contraseña.", values);
  }

  if (password !== confirmPassword) {
    return signupFieldError("confirmPassword", "Las contraseñas no coinciden.", values);
  }

  if (password.length < 8) {
    return signupFieldError("password", "La contraseña debe tener mínimo 8 caracteres.", values);
  }

  if (password.length > 128) {
    return signupFieldError("password", "La contraseña es demasiado larga.", values);
  }

  if (isWeakPassword(password)) {
    return signupFieldError("password", "Usa una contraseña más segura: combina letras y números.", values);
  }

  try {
    const { error } = await auth.signUp.email({ name, email, password });

    if (error) {
      const friendly = getSignupError(error);
      if (friendly.field) {
        return signupFieldError(friendly.field, friendly.message, values);
      }
      return { error: friendly.message, values };
    }
  } catch (error) {
    const friendly = getSignupError(error);
    if (friendly.field) {
      return signupFieldError(friendly.field, friendly.message, values);
    }
    return { error: friendly.message, values };
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
