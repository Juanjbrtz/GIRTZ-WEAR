import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Cómo comprar" };

export default function HowToBuyPage() {
  return (
    <InfoPage eyebrow="GIRTZ WEAR / COMPRA" title="CÓMO COMPRAR">
      <p><strong>1. Elige tu modelo.</strong> Explora el catálogo y entra a la referencia que te interesa.</p>
      <p><strong>2. Selecciona tu talla EUR.</strong> Cada producto muestra las tallas habilitadas. La disponibilidad final se confirma antes de cerrar la compra.</p>
      <p><strong>3. Agrégalo al carrito.</strong> Puedes incluir uno o varios modelos y ajustar talla o cantidad desde tu selección.</p>
      <p><strong>4. Envía tu carrito por WhatsApp.</strong> Recibimos automáticamente marca, modelo, precio, talla y cantidad para confirmar disponibilidad y valor del envío.</p>
      <p><strong>5. Confirmamos pago y envío.</strong> Cuando todo esté disponible, coordinamos contigo el cierre del pedido.</p>
      <p><Link href="/shop">IR AL CATÁLOGO ↗</Link></p>
    </InfoPage>
  );
}
