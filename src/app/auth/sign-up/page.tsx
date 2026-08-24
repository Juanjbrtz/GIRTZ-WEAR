import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function SignUpPage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <AuthPanel mode="sign-up" />
      <SiteFooter />
    </main>
  );
}
