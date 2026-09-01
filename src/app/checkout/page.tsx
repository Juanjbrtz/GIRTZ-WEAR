import { CheckoutPanel } from "@/components/checkout-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAccount } from "@/lib/session";

export const metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const account = await requireAccount();
  const customer = account.customer;

  return (
    <main className="inner-page checkout-page">
      <SiteHeader />
      <CheckoutPanel
        defaults={{
          name: customer?.name || account.session.user.name || "",
          email: customer?.email || account.session.user.email || "",
          phone: customer?.phone || "",
          address: customer?.address || "",
          city: customer?.city || "",
        }}
      />
      <SiteFooter />
    </main>
  );
}
