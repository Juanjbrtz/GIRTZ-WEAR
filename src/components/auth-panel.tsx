"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  type AuthActionState,
  type AuthField,
} from "@/app/auth/actions";

type AuthPanelProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const action = mode === "sign-in" ? signInWithEmail : signUpWithEmail;
  const [state, formAction, pending] = useActionState<AuthActionState | null, FormData>(
    action,
    null,
  );
  const isSignIn = mode === "sign-in";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state) return;

    if (typeof state.values?.name === "string") setName(state.values.name);
    if (typeof state.values?.email === "string") setEmail(state.values.email);

    // Nunca repoblamos una contraseña después de un intento fallido.
    setPassword("");

    const refs: Record<AuthField, React.RefObject<HTMLInputElement | null>> = {
      name: nameRef,
      email: emailRef,
      password: passwordRef,
    };
    const target = state.errorField ? refs[state.errorField]?.current : null;
    if (target) {
      requestAnimationFrame(() => {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [state]);

  const nameError = !isSignIn ? state?.fieldErrors?.name : undefined;
  const emailError = !isSignIn ? state?.fieldErrors?.email : undefined;
  const passwordError = !isSignIn ? state?.fieldErrors?.password : undefined;

  return (
    <section className="auth-shell">
      <div className="auth-editorial">
        <span className="eyebrow">GIRTZ WEAR / CUENTA</span>
        <h1>{isSignIn ? "BIENVENIDO DE NUEVO." : "CREA TU CUENTA."}</h1>
        <p>
          {isSignIn
            ? "Consulta tus pedidos, estados de envío y datos de compra desde un solo lugar."
            : "Guarda tu historial de pedidos y consulta el estado de cada compra cuando lo necesites."}
        </p>
      </div>

      <div className="auth-form-wrap">
        <form action={formAction} className="auth-form" noValidate>
          {!isSignIn ? (
            <label className={`auth-field${nameError ? " auth-field-invalid" : ""}`}>
              <span>NOMBRE</span>
              <input
                ref={nameRef}
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "name-error" : undefined}
              />
              {nameError ? <small id="name-error" className="auth-inline-error">{nameError}</small> : null}
            </label>
          ) : null}

          <label className={`auth-field${emailError ? " auth-field-invalid" : ""}`}>
            <span>CORREO</span>
            <input
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError ? <small id="email-error" className="auth-inline-error">{emailError}</small> : null}
          </label>

          <label className={`auth-field${passwordError ? " auth-field-invalid" : ""}`}>
            <span>CONTRASEÑA</span>
            <input
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={
                passwordError
                  ? "password-error"
                  : !isSignIn
                    ? "password-requirements"
                    : undefined
              }
            />
            {passwordError ? (
              <small id="password-error" className="auth-inline-error">{passwordError}</small>
            ) : !isSignIn ? (
              <small id="password-requirements" className="auth-field-hint">
                Mínimo 8 caracteres; combina letras y números.
              </small>
            ) : null}
          </label>

          {state?.error ? (
            <div className="auth-error-card" role="alert" aria-live="polite">
              <strong>{state.error}</strong>
              {isSignIn && state.suggestion ? <span>{state.suggestion}</span> : null}
            </div>
          ) : null}

          <button className="primary-button auth-submit" type="submit" disabled={pending}>
            {pending
              ? isSignIn
                ? "INGRESANDO..."
                : "CREANDO CUENTA..."
              : isSignIn
                ? "INICIAR SESIÓN"
                : "CREAR CUENTA"}
          </button>

          <p className="auth-switch">
            {isSignIn ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
            <Link href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}>
              {isSignIn ? "Crear cuenta" : "Iniciar sesión"}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
