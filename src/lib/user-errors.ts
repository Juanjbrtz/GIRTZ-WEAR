export type FriendlyLoginError = {
  message: string;
  suggestion?: string;
};

function messageOf(error: unknown) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || "");
  }
  return "";
}

function normalized(error: unknown) {
  return messageOf(error).trim().toLowerCase();
}

export function getLoginError(error: unknown): FriendlyLoginError {
  const value = normalized(error);

  if (value.includes("invalid origin") || value.includes("origin is not allowed") || value.includes("untrusted origin")) {
    return {
      message: "No pudimos validar el acceso desde esta dirección.",
      suggestion: "Abre GIRTZ desde la URL oficial. Si estás usando un enlace de preview o antiguo, vuelve a entrar desde la dirección principal e inténtalo de nuevo.",
    };
  }

  if (
    value.includes("invalid email") ||
    value.includes("invalid password") ||
    value.includes("invalid credentials") ||
    value.includes("incorrect password") ||
    value.includes("user not found") ||
    value.includes("credential")
  ) {
    return {
      message: "Correo o contraseña incorrectos.",
      suggestion: "Verifica que el correo esté bien escrito y vuelve a ingresar tu contraseña.",
    };
  }

  if (value.includes("email not verified") || value.includes("verify your email")) {
    return {
      message: "Tu correo todavía no está verificado.",
      suggestion: "Revisa tu correo y completa la verificación antes de iniciar sesión.",
    };
  }

  if (value.includes("too many") || value.includes("rate limit")) {
    return {
      message: "Se hicieron demasiados intentos en poco tiempo.",
      suggestion: "Espera unos minutos antes de volver a intentar.",
    };
  }

  if (value.includes("network") || value.includes("fetch") || value.includes("connection")) {
    return {
      message: "No pudimos conectar con el servicio de acceso.",
      suggestion: "Comprueba tu conexión y vuelve a intentarlo.",
    };
  }

  return {
    message: "No fue posible iniciar sesión.",
    suggestion: "Vuelve a intentarlo. Si el problema continúa, entra nuevamente desde la página principal.",
  };
}

export function getSignupError(error: unknown) {
  const value = normalized(error);

  if (value.includes("already") || value.includes("exists") || value.includes("duplicate") || value.includes("registered")) {
    return "Ya existe una cuenta con este correo.";
  }
  if (value.includes("invalid origin") || value.includes("origin is not allowed") || value.includes("untrusted origin")) {
    return "No pudimos crear la cuenta desde esta dirección.";
  }
  if (value.includes("password") && (value.includes("weak") || value.includes("short") || value.includes("length"))) {
    return "La contraseña no cumple los requisitos de seguridad.";
  }
  if (value.includes("email") && value.includes("invalid")) {
    return "Ingresa un correo válido.";
  }
  if (value.includes("network") || value.includes("fetch") || value.includes("connection")) {
    return "No pudimos conectar con el servicio de registro.";
  }
  return "No fue posible crear la cuenta.";
}

export function getShortUserError(error: unknown, fallback = "No fue posible completar la acción.") {
  const raw = messageOf(error).trim();
  const value = raw.toLowerCase();

  if (!raw) return fallback;
  if (value.includes("database_url") || value.includes("connection string") || value.includes("postgres") || value.includes("drizzle") || value.includes("sql")) {
    return "El servicio no está disponible en este momento.";
  }
  if (value.includes("invalid origin") || value.includes("origin is not allowed") || value.includes("untrusted origin")) {
    return "No pudimos validar esta solicitud.";
  }
  if (value.includes("network") || value.includes("fetch") || value.includes("connection")) {
    return "No pudimos conectar con el servicio.";
  }
  if (value.includes("unauthorized") || value.includes("forbidden") || value.includes("permission")) {
    return "No tienes permiso para realizar esta acción.";
  }
  if (value.includes("duplicate") || value.includes("unique constraint")) {
    return "Este registro ya existe.";
  }

  const looksTechnical = /\b(error|exception|constraint|relation|column|syntax|stack|digest|query|http\s?\d{3})\b/i.test(raw);
  if (looksTechnical || raw.length > 140) return fallback;

  return raw;
}
