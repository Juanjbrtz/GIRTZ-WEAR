"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { getPasswordRuleError } from "@/lib/password-rules";

type PasswordField = "current" | "password" | "confirmPassword";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<PasswordField | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setFieldError("current");
      setError("Ingresa tu contraseña actual.");
      return;
    }
    if (!confirmPassword) {
      setFieldError("confirmPassword");
      setError("Confirma la nueva contraseña.");
      return;
    }
    if (password !== confirmPassword) {
      setFieldError("confirmPassword");
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordError = getPasswordRuleError(password);
    if (passwordError) {
      setFieldError("password");
      setError(passwordError);
      return;
    }
    if (currentPassword === password) {
      setFieldError("password");
      setError("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    setPending(true);
    try {
      const { error: changeError } = await authClient.changePassword({
        currentPassword,
        newPassword: password,
        revokeOtherSessions: true,
      });

      if (changeError) {
        const raw = `${changeError.message || ""} ${"code" in changeError ? changeError.code || "" : ""}`.toLowerCase();
        if (raw.includes("password") || raw.includes("credential")) {
          setFieldError("current");
          setError("La contraseña actual no es correcta.");
        } else {
          setError("No pudimos cambiar la contraseña en este momento.");
        }
        return;
      }

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("No pudimos cambiar la contraseña en este momento.");
    } finally {
      setPending(false);
    }
  }

  function clearFieldError(field: PasswordField) {
    if (fieldError === field) {
      setFieldError(null);
      setError("");
    }
    setSuccess(false);
  }

  return (
    <form className="account-password-form" onSubmit={handleSubmit} noValidate>
      <label className={fieldError === "current" ? "auth-field-invalid" : undefined}>
        <span>CONTRASEÑA ACTUAL</span>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            clearFieldError("current");
          }}
        />
        {fieldError === "current" && error ? <small className="auth-inline-error">{error}</small> : null}
      </label>

      <label className={fieldError === "password" ? "auth-field-invalid" : undefined}>
        <span>NUEVA CONTRASEÑA</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearFieldError("password");
          }}
        />
        {fieldError === "password" && error ? <small className="auth-inline-error">{error}</small> : <small className="auth-field-hint">Mínimo 8 caracteres; combina letras y números.</small>}
      </label>

      <label className={fieldError === "confirmPassword" ? "auth-field-invalid" : undefined}>
        <span>CONFIRMAR NUEVA CONTRASEÑA</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            clearFieldError("confirmPassword");
          }}
        />
        {fieldError === "confirmPassword" && error ? <small className="auth-inline-error">{error}</small> : null}
      </label>

      {!fieldError && error ? <div className="account-notice error" role="alert">{error}</div> : null}
      {success ? <div className="account-notice success" role="status">Contraseña actualizada correctamente. Cerramos las demás sesiones por seguridad.</div> : null}

      <button type="submit" className="primary-button" disabled={pending}>
        {pending ? "ACTUALIZANDO..." : "ACTUALIZAR CONTRASEÑA"}
      </button>
    </form>
  );
}
