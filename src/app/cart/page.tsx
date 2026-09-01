import { CartPanel } from "@/components/cart-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Carrito",
};

export default function CartPage() {
  return (
    <main className="inner-page cart-page">
      <SiteHeader />
      <CartPanel />
      <SiteFooter />
    </main>
  );
}
