"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { getPasswordRuleError } from "@/lib/password-rules";

export function ResetPasswordForm({ token, invalid }: { token?: string; invalid?: boolean }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<"password" | "confirmPassword" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  if (invalid || !token) {
    return (
      <section className="auth-shell password-recovery-shell">
        <div className="auth-editorial">
          <span className="eyebrow">GIRTZ WEAR / SEGURIDAD</span>
          <h1>ENLACE NO VÁLIDO.</h1>
          <p>El enlace de recuperación venció o ya fue utilizado.</p>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            <div className="auth-error-card" role="alert">
              <strong>Solicita un nuevo enlace de recuperación.</strong>
            </div>
            <Link href="/auth/forgot-password" className="primary-button auth-submit">SOLICITAR NUEVO ENLACE</Link>
            <p className="auth-switch"><Link href="/auth/sign-in">Volver a iniciar sesión</Link></p>
          </div>
        </div>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setError("");

    if (!confirmPassword) {
      setFieldError("confirmPassword");
      setError("Confirma tu nueva contraseña.");
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

    setPending(true);
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError("El enlace venció o no es válido. Solicita uno nuevo.");
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("No pudimos cambiar la contraseña en este momento.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <section className="auth-shell password-recovery-shell">
        <div className="auth-editorial">
          <span className="eyebrow">GIRTZ WEAR / SEGURIDAD</span>
          <h1>CONTRASEÑA ACTUALIZADA.</h1>
          <p>Ya puedes ingresar nuevamente a tu cuenta con la nueva contraseña.</p>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            <div className="password-success-card"><strong>CAMBIO COMPLETADO</strong><span>Tu nueva contraseña ya está activa.</span></div>
            <Link href="/auth/sign-in" className="primary-button auth-submit">INICIAR SESIÓN</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-shell password-recovery-shell">
      <div className="auth-editorial">
        <span className="eyebrow">GIRTZ WEAR / SEGURIDAD</span>
        <h1>CREA UNA NUEVA CONTRASEÑA.</h1>
        <p>Usa una contraseña diferente y segura para recuperar el acceso a tu cuenta.</p>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className={`auth-field${fieldError === "password" ? " auth-field-invalid" : ""}`}>
            <span>NUEVA CONTRASEÑA</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldError(null);
                setError("");
              }}
            />
            {fieldError === "password" && error ? <small className="auth-inline-error" role="alert">{error}</small> : <small className="auth-field-hint">Mínimo 8 caracteres; combina letras y números.</small>}
          </label>

          <label className={`auth-field${fieldError === "confirmPassword" ? " auth-field-invalid" : ""}`}>
            <span>CONFIRMAR CONTRASEÑA</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setFieldError(null);
                setError("");
              }}
            />
            {fieldError === "confirmPassword" && error ? <small className="auth-inline-error" role="alert">{error}</small> : <small className="auth-field-hint">Repite exactamente la contraseña anterior.</small>}
          </label>

          {!fieldError && error ? <div className="auth-error-card" role="alert"><strong>{error}</strong></div> : null}

          <button className="primary-button auth-submit" type="submit" disabled={pending}>
            {pending ? "ACTUALIZANDO..." : "CAMBIAR CONTRASEÑA"}
          </button>
        </form>
      </div>
    </section>
  );
}
