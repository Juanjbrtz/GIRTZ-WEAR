import { CartPanel } from "@/components/cart-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getWhatsappNumber } from "@/lib/store-settings";

export const metadata = {
  title: "Carrito de consulta",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <main className="inner-page cart-page cart-page-v3">
      <SiteHeader />
      <CartPanel whatsappNumber={whatsappNumber} />
      <SiteFooter />
    </main>
  );
}
