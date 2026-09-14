"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        await registration.update();
      } catch {
        // La PWA nunca debe impedir que la tienda funcione como web normal.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        registration?.update().catch(() => undefined);
      }
    };

    const handleOnline = () => {
      registration?.update().catch(() => undefined);
    };

    register();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
