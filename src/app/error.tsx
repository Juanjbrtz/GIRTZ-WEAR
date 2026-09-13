"use client";

import { getShortUserError } from "@/lib/user-errors";

export default function AppError({ error }: { error: Error & { digest?: string } }) {
  const message = getShortUserError(error, "No pudimos completar esta solicitud.");

  return (
    <main className="friendly-error-page" role="alert">
      <section>
        <span>GIRTZ WEAR</span>
        <h1>No se pudo completar.</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
