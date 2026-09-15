import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { getWhatsappNumber } from "@/lib/store-settings";

export const metadata: Metadata = { title: "Contacto" };

export default async function ContactPage() {
  const whatsappNumber = await getWhatsappNumber();
  const number = whatsappNumber.replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hola, quiero recibir información de GIRTZ WEAR.")}`
    : null;

  return (
    <InfoPage eyebrow="GIRTZ WEAR / CONTACT" title="HABLEMOS">
      <p>Escríbenos para consultar modelos, tallas, disponibilidad, envíos o seguimiento de tu pedido.</p>
      <p>WhatsApp es nuestro canal principal de atención y también el medio donde confirmamos la disponibilidad final antes de cerrar una compra.</p>
      {href ? (
        <p><a href={href} target="_blank" rel="noreferrer">ABRIR WHATSAPP ↗</a></p>
      ) : (
        <p>El canal de WhatsApp está temporalmente en configuración.</p>
      )}
    </InfoPage>
  );
}
