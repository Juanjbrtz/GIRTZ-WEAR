import { CheckoutPanel } from "@/components/checkout-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Finalizar compra" };

export default function CheckoutPage() {
  return (
    <main className="inner-page checkout-page">
      <SiteHeader />
      <CheckoutPanel />
      <SiteFooter />
    </main>
  );
}
