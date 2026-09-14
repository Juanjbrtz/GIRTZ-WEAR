"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getShortUserError } from "@/lib/user-errors";
import "./ux-states.css";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const message = getShortUserError(error, "No pudimos completar esta solicitud.");

  useEffect(() => {
    console.error("GIRTZ route error", error);
  }, [error]);

  return (
    <main className="ux-state-shell" role="alert">
      <section className="ux-state-card">
        <span>GIRTZ WEAR / ERROR</span>
        <h1>No se pudo completar.</h1>
        <p>{message}</p>
        <div className="ux-state-actions">
          <button type="button" className="primary" onClick={reset}>REINTENTAR</button>
          <Link href="/">IR AL INICIO</Link>
        </div>
      </section>
    </main>
  );
}
