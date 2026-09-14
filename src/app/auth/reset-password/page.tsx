import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Restablecer contraseña" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <main className="inner-page">
      <SiteHeader />
      <ResetPasswordForm token={token} invalid={Boolean(error)} />
      <SiteFooter />
    </main>
  );
}
