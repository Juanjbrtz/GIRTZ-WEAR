"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ProductCard } from "@/components/product-card";
import type { Audience, Product } from "@/data/products";

type Category = "todos" | "hombre" | "mujer" | "unisex";

const filters: Array<{ label: string; value: Category }> = [
  { label: "Todo", value: "todos" },
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Unisex", value: "unisex" },
];

const categoryMap: Record<Exclude<Category, "todos">, Audience> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

function normalizeCategory(value?: string | null): Category {
  if (value === "hombre" || value === "mujer" || value === "unisex") return value;
  return "todos";
}

function matchesCategory(productAudience: Audience, category: Category) {
  if (category === "todos") return true;
  if (category === "unisex") return productAudience === "Unisex";
  if (category === "hombre") return productAudience === "Hombre" || productAudience === "Unisex";
  if (category === "mujer") return productAudience === "Mujer" || productAudience === "Unisex";
  return true;
}

function buildHref(category: Category, brand = "") {
  const params = new URLSearchParams();
  if (category !== "todos") params.set("categoria", category);
  if (brand) params.set("marca", brand);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: normalizeCategory(params.get("categoria")),
    brand: params.get("marca") || "",
  };
}

export function CatalogClient({
  products,
  initialCategory = "todos",
  initialBrand = "",
}: {
  products: Product[];
  initialCategory?: string;
  initialBrand?: string;
}) {
  const [category, setCategory] = useState<Category>(normalizeCategory(initialCategory));
  const [brand, setBrand] = useState(initialBrand);

  const categoryProducts = useMemo(
    () => products.filter((product) => matchesCategory(product.audience, category)),
    [products, category],
  );

  const brands = useMemo(
    () => [...new Set(categoryProducts.map((product) => product.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [categoryProducts],
  );

  const activeBrand = brands.includes(brand) ? brand : "";
  const visibleProducts = useMemo(
    () => activeBrand ? categoryProducts.filter((product) => product.brand === activeBrand) : categoryProducts,
    [activeBrand, categoryProducts],
  );

  useEffect(() => {
    function handlePopState() {
      const next = readUrlFilters();
      setCategory(next.category);
      setBrand(next.brand);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function syncUrl(nextCategory: Category, nextBrand = "", mode: "push" | "replace" = "push") {
    const href = buildHref(nextCategory, nextBrand);
    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method]({ category: nextCategory, brand: nextBrand }, "", href);
  }

  function selectCategory(event: MouseEvent<HTMLAnchorElement>, nextCategory: Category) {
    event.preventDefault();
    if (nextCategory === category && !activeBrand) return;
    setCategory(nextCategory);
    setBrand("");
    syncUrl(nextCategory);
  }

  function selectBrand(event: MouseEvent<HTMLAnchorElement>, nextBrand: string) {
    event.preventDefault();
    const normalizedBrand = nextBrand === activeBrand ? "" : nextBrand;
    setBrand(normalizedBrand);
    syncUrl(category, normalizedBrand);
  }

  return (
    <>
      <section className="refined-shop-head">
        <div>
          <span>CATÁLOGO / {String(visibleProducts.length).padStart(2, "0")}</span>
          <h1>Catálogo</h1>
        </div>
        <p>Explora por categoría o marca. Agrega tus modelos favoritos y confirma talla, disponibilidad y envío por WhatsApp.</p>
      </section>

      <section className="editorial-filter-bar refined-filter-bar">
        <nav aria-label="Filtrar catálogo por sección">
          {filters.map((filter) => (
            <a
              key={filter.value}
              href={buildHref(filter.value)}
              className={category === filter.value ? "active" : undefined}
              aria-current={category === filter.value ? "page" : undefined}
              onClick={(event) => selectCategory(event, filter.value)}
            >
              {filter.label}
            </a>
          ))}
        </nav>

        {brands.length ? (
          <nav className="editorial-brand-nav" aria-label="Filtrar catálogo por marca">
            <span>Marca</span>
            <a
              href={buildHref(category)}
              className={!activeBrand ? "active" : undefined}
              aria-current={!activeBrand ? "page" : undefined}
              onClick={(event) => selectBrand(event, "")}
            >
              Todas
            </a>
            {brands.map((itemBrand) => (
              <a
                key={itemBrand}
                href={buildHref(category, itemBrand)}
                className={activeBrand === itemBrand ? "active" : undefined}
                aria-current={activeBrand === itemBrand ? "page" : undefined}
                onClick={(event) => selectBrand(event, itemBrand)}
              >
                {itemBrand}
              </a>
            ))}
          </nav>
        ) : null}
      </section>

      <section className="editorial-catalog-meta refined-catalog-meta">
        <span>{category === "todos" ? "Todos los modelos" : categoryMap[category]}</span>
        <span>{activeBrand || "Todas las marcas"}</span>
        <span>{visibleProducts.length} {visibleProducts.length === 1 ? "referencia" : "referencias"}</span>
      </section>

      {visibleProducts.length ? (
        <section className="editorial-product-grid refined-product-grid" aria-live="polite">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </section>
      ) : (
        <section className="editorial-empty refined-empty" aria-live="polite">
          <span>FILTROS</span>
          <h2>No encontramos modelos con esta selección.</h2>
          <a href="/shop" onClick={(event) => selectCategory(event, "todos")}>LIMPIAR FILTROS ↗</a>
        </section>
      )}
    </>
  );
}
