import { redirect } from "next/navigation";

export const metadata = {
  title: "Carrito",
};

export default function CartPage() {
  redirect("/shop?carrito=1");
}
