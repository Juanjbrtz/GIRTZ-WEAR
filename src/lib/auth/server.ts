import { createHash, randomBytes } from "node:crypto";
import { createNeonAuth } from "@neondatabase/auth/next/server";

const DEFAULT_AUTH_BASE_URL =
  "https://ep-spring-mouse-af6glz0b.neonauth.c-2.us-west-2.aws.neon.tech/neondb/auth";

function resolveCookieSecret() {
  if (process.env.NEON_AUTH_COOKIE_SECRET) {
    return process.env.NEON_AUTH_COOKIE_SECRET;
  }

  if (process.env.DATABASE_URL) {
    return createHash("sha256")
      .update(`girtz-auth-cookie:${process.env.DATABASE_URL}`)
      .digest("hex");
  }

  return randomBytes(48).toString("hex");
}

export function isAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_COOKIE_SECRET || process.env.DATABASE_URL);
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || DEFAULT_AUTH_BASE_URL,
  cookies: {
    secret: resolveCookieSecret(),
  },
  logLevel: "warn",
});
