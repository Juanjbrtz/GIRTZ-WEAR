"use client";

import Link from "next/link";
import { getShortUserError } from "@/lib/user-errors";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const message = getShortUserError(error, "Ocurrió un problema temporal al cargar la información.");

  return (
    <main className="girtz-state-shell" role="alert">
      <section className="girtz-state-card">
        <div className="girtz-state-brand">GIRTZ</div>
        <span className="girtz-state-eyebrow">NO PUDIMOS CARGAR ESTA PANTALLA</span>
        <h1 className="girtz-state-title">INTÉNTALO DE NUEVO.</h1>
        <p className="girtz-state-copy">{message}</p>
        <div className="girtz-state-actions">
          <button type="button" className="girtz-state-button" onClick={() => reset()}>REINTENTAR</button>
          <Link className="girtz-state-button secondary" href="/">IR AL INICIO</Link>
        </div>
      </section>
    </main>
  );
}
