import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Envíos" };

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="GIRTZ WEAR / SERVICE" title="ENVÍOS">
      <p>
        Estamos terminando de definir cobertura, tiempos y costos de envío con
        los proveedores que participarán en el primer drop.
      </p>
      <p>
        Antes del lanzamiento esta sección mostrará la información definitiva
        para Colombia y el seguimiento disponible para cada pedido.
      </p>
    </InfoPage>
  );
}
