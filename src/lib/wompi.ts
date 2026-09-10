import { createHash, timingSafeEqual } from "node:crypto";

const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isWompiConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY &&
      process.env.WOMPI_INTEGRITY_SECRET,
  );
}

export function buildWompiCheckoutUrl({
  orderId,
  accessToken,
  reference,
  totalCop,
  customerEmail,
  customerName,
  customerPhone,
}: {
  orderId: string;
  accessToken: string;
  reference: string;
  totalCop: number;
  customerEmail?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
}) {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!publicKey || !integritySecret) return null;

  const amountInCents = Math.round(totalCop * 100);
  const signature = sha256(`${reference}${amountInCents}COP${integritySecret}`);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://girtz-wear.vercel.app").replace(/\/$/, "");
  const redirectUrl = `${siteUrl}/payments/wompi/return?order=${encodeURIComponent(orderId)}&key=${encodeURIComponent(accessToken)}`;

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(amountInCents),
    reference,
    "signature:integrity": signature,
    "redirect-url": redirectUrl,
  });

  if (customerEmail) params.set("customer-data:email", customerEmail);
  if (customerName) params.set("customer-data:full-name", customerName);
  if (customerPhone) params.set("customer-data:phone-number", customerPhone.replace(/\D/g, ""));

  return `${WOMPI_CHECKOUT_URL}?${params.toString()}`;
}

type WompiEvent = {
  event?: string;
  data?: Record<string, unknown>;
  signature?: {
    properties?: string[];
    checksum?: string;
  };
  timestamp?: number | string;
};

function getNestedValue(root: unknown, path: string) {
  const parts = path.split(".");
  let current: unknown = root;
  for (const part of parts) {
    if (!current || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }
  return current == null ? "" : String(current);
}

export function verifyWompiEvent(event: WompiEvent, headerChecksum?: string | null) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  const properties = event.signature?.properties;
  const provided = headerChecksum || event.signature?.checksum;
  if (!secret || !properties?.length || !provided || event.timestamp == null || !event.data) return false;

  const payload = `${properties.map((property) => getNestedValue(event.data, property)).join("")}${event.timestamp}${secret}`;
  const expected = sha256(payload).toLowerCase();
  const actual = provided.toLowerCase();
  if (expected.length !== actual.length) return false;

  return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export type { WompiEvent };
