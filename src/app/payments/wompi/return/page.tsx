import { redirect } from "next/navigation";

export const metadata = { title: "Resultado de pago" };

export default async function WompiReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; key?: string }>;
}) {
  const { order, key } = await searchParams;
  if (!order || !key) redirect("/shop");
  redirect(`/order/${encodeURIComponent(order)}?key=${encodeURIComponent(key)}`);
}
