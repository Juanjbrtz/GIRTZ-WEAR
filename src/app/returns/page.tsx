import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Cambios" };

export default function ReturnsPage() {
  return (
    <InfoPage eyebrow="GIRTZ WEAR / SERVICE" title="CAMBIOS">
      <p>
        La política de cambios del primer drop se publicará cuando confirmemos
        las condiciones definitivas con los proveedores y la operación de despacho.
      </p>
      <p>
        No mostraremos condiciones provisionales como si fueran definitivas. La
        versión de lanzamiento indicará claramente plazos, estado del producto y
        proceso de solicitud.
      </p>
    </InfoPage>
  );
}
