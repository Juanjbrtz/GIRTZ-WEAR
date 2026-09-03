"use client";

import { useMemo } from "react";
import { useCart, type CartItem } from "@/components/cart-provider";
import { formatCop, type Product } from "@/data/products";

type ConsultItem = Pick<CartItem, "slug" | "name" | "brand" | "price" | "quantity">;

function mergeItems(cart: CartItem[], current?: Product): ConsultItem[] {
  const bySlug = new Map<string, ConsultItem>();

  for (const item of cart) {
    bySlug.set(item.slug, {
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
    });
  }

  if (current && !bySlug.has(current.slug)) {
    bySlug.set(current.slug, {
      slug: current.slug,
      name: current.name,
      brand: current.brand,
      price: current.price,
      quantity: 1,
    });
  }

  const items = [...bySlug.values()];
  if (!current) return items;

  return items.sort((a, b) => {
    if (a.slug === current.slug) return -1;
    if (b.slug === current.slug) return 1;
    return 0;
  });
}

function createMessage(items: ConsultItem[]) {
  const lines = items.map((item, index) =>
    `${index + 1}. ${item.brand} ${item.name} — ${formatCop(item.price)} — Cantidad: ${item.quantity}`,
  );

  return [
    "Hola, quiero consultar disponibilidad en GIRTZ WEAR de los siguientes modelos:",
    "",
    ...lines,
    "",
    "¿Qué tallas tienen disponibles para estos modelos?",
    "También quisiera confirmar el valor del envío.",
  ].join("\n");
}

export function WhatsappConsultButton({
  whatsappNumber,
  product,
  className = "whatsapp-button",
  label = "CONSULTAR DISPONIBILIDAD",
}: {
  whatsappNumber: string;
  product?: Product;
  className?: string;
  label?: string;
}) {
  const { items } = useCart();

  const href = useMemo(() => {
    const number = whatsappNumber.replace(/\D/g, "");
    const consultationItems = mergeItems(items, product);
    if (!number || !consultationItems.length) return null;

    return `https://wa.me/${number}?text=${encodeURIComponent(createMessage(consultationItems))}`;
  }, [items, product, whatsappNumber]);

  if (!href) {
    return (
      <button
        type="button"
        className={`${className} is-disabled`.trim()}
        disabled
        title={
          whatsappNumber
            ? "Agrega productos para consultar disponibilidad."
            : "El número de WhatsApp se configurará desde el panel administrativo."
        }
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
