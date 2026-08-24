import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <InfoPage eyebrow="GIRTZ WEAR / CONTACT" title="HABLEMOS">
      <p>
        El canal de atención y compra por WhatsApp se conectará antes del
        lanzamiento. Esta ruta ya queda preparada para centralizar soporte,
        preguntas sobre tallas y seguimiento de pedidos.
      </p>
      <p>
        Por ahora no publicamos un número provisional para evitar que quede una
        referencia incorrecta en producción.
      </p>
    </InfoPage>
  );
}
