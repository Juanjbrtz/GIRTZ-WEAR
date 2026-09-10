import { revalidatePath } from "next/cache";
import { findOrderByPaymentReference, setOrderPaymentState, type PaymentState } from "@/lib/order-lifecycle";
import { verifyWompiEvent, type WompiEvent } from "@/lib/wompi";

export const runtime = "nodejs";

function readTransaction(event: WompiEvent) {
  const data = event.data as Record<string, unknown> | undefined;
  const transaction = data?.transaction;
  return transaction && typeof transaction === "object"
    ? (transaction as Record<string, unknown>)
    : null;
}

function mapStatus(value: unknown): PaymentState | null {
  const status = String(value || "").toUpperCase();
  if (status === "APPROVED") return "paid";
  if (status === "DECLINED" || status === "ERROR") return "failed";
  if (status === "VOIDED") return "refunded";
  if (status === "PENDING") return "pending";
  return null;
}

export async function POST(request: Request) {
  let event: WompiEvent;
  try {
    event = (await request.json()) as WompiEvent;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!verifyWompiEvent(event, request.headers.get("x-event-checksum"))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.event !== "transaction.updated") {
    return Response.json({ ok: true });
  }

  const transaction = readTransaction(event);
  if (!transaction) return Response.json({ error: "Missing transaction" }, { status: 400 });

  const reference = String(transaction.reference || "");
  const transactionId = String(transaction.id || "");
  const currency = String(transaction.currency || "").toUpperCase();
  const amountInCents = Number(transaction.amount_in_cents ?? transaction.amountInCents ?? 0);
  const paymentStatus = mapStatus(transaction.status);

  if (!reference || !transactionId || !paymentStatus || currency !== "COP") {
    return Response.json({ error: "Invalid transaction" }, { status: 400 });
  }

  const order = await findOrderByPaymentReference(reference);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  if (amountInCents !== order.total * 100) {
    return Response.json({ error: "Amount mismatch" }, { status: 409 });
  }

  try {
    await setOrderPaymentState({
      orderId: order.id,
      paymentStatus,
      provider: "wompi",
      transactionId,
    });
  } catch (error) {
    console.error("Wompi payment update failed", error);
    return Response.json({ error: "Could not update order" }, { status: 409 });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/sales");
  revalidatePath("/shop");
  revalidatePath(`/order/${order.id}`);

  return Response.json({ ok: true });
}
