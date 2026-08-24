"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  type AuthActionState,
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
        <form action={formAction} className="auth-form">
          {!isSignIn ? (
            <label>
              <span>NOMBRE</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
          ) : null}

          <label>
            <span>CORREO</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            <span>CONTRASEÑA</span>
            <input
              name="password"
              type="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </label>

          {state?.error ? <p className="form-error">{state.error}</p> : null}

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
