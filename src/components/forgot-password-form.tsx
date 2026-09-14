"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSent(false);

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Ingresa tu correo.");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setError("Ingresa un correo válido.");
      return;
    }

    setPending(true);
    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { error: requestError } = await authClient.requestPasswordReset({
        email: normalizedEmail,
        redirectTo,
      });

      if (requestError) {
        setError("No pudimos enviar el enlace en este momento.");
        return;
      }

      setSent(true);
    } catch {
      setError("No pudimos enviar el enlace en este momento.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-shell password-recovery-shell">
      <div className="auth-editorial">
        <span className="eyebrow">GIRTZ WEAR / SEGURIDAD</span>
        <h1>RECUPERA TU ACCESO.</h1>
        <p>Te enviaremos un enlace para crear una nueva contraseña de forma segura.</p>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className={`auth-field${error ? " auth-field-invalid" : ""}`}>
            <span>CORREO</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setSent(false);
              }}
              aria-invalid={Boolean(error)}
            />
            {error ? <small className="auth-inline-error" role="alert">{error}</small> : null}
          </label>

          {sent ? (
            <div className="password-success-card" role="status">
              <strong>REVISA TU CORREO</strong>
              <span>Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.</span>
            </div>
          ) : null}

          <button className="primary-button auth-submit" type="submit" disabled={pending}>
            {pending ? "ENVIANDO..." : "ENVIAR ENLACE"}
          </button>

          <p className="auth-switch">
            <Link href="/auth/sign-in">Volver a iniciar sesión</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
