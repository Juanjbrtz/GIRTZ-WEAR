import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Guía de tallas" };

export default function SizeGuidePage() {
  return (
    <InfoPage eyebrow="GIRTZ WEAR / TALLAS" title="GUÍA DE TALLAS">
      <p>Las referencias de GIRTZ WEAR se manejan principalmente en talla EUR. En cada producto verás únicamente las tallas habilitadas para esa referencia.</p>
      <p>Si ya conoces tu talla EUR habitual, selecciónala directamente en el producto antes de agregarlo al carrito.</p>
      <p>Si tienes dudas con la equivalencia, puedes enviarnos por WhatsApp una foto de la marquilla de uno de tus tenis actuales. La usamos como referencia para ayudarte a escoger con mayor precisión.</p>
      <p>La disponibilidad final de la talla siempre se confirma por WhatsApp antes de cerrar la compra.</p>
      <p><Link href="/shop">VER CATÁLOGO Y TALLAS ↗</Link></p>
    </InfoPage>
  );
}
