export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    {
      error:
        "La tienda ya no crea pedidos desde checkout. Usa el carrito para consultar disponibilidad por WhatsApp.",
    },
    { status: 410 },
  );
}
