import { redirect } from "next/navigation";

export const metadata = {
  title: "Consulta de disponibilidad",
};

export default function CheckoutPage() {
  redirect("/cart");
}
