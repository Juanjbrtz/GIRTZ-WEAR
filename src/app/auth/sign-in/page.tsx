import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function SignInPage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <AuthPanel mode="sign-in" />
      <SiteFooter />
    </main>
  );
}
