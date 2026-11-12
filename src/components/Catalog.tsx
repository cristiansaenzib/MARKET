"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Brand, Product } from "@/lib/types";
import { isSoldOut, sortSizes } from "@/lib/utils";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  brands: Brand[];
  /** Si se indica, el catálogo queda fijo en esa marca (página de marca). */
  lockedBrand?: string;
};

const SORTS = {
  relevancia: "Destacados",
  nuevo: "Más nuevos",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
} as const;
type SortKey = keyof typeof SORTS;

const ALL = "";

// Los filtros viven en la URL (?categoria=Hoodies&talla=M…): se pueden
// compartir, sobreviven al recargar y el botón "atrás" funciona.
export default function Catalog({ products, brands, lockedBrand }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const brand = lockedBrand ?? params.get("marca") ?? ALL;
  const category = params.get("categoria") ?? ALL;
  const size = params.get("talla") ?? ALL;
  const color = params.get("color") ?? ALL;
  const onlyAvailable = params.get("disponible") === "1";
  const onlyPromo = params.get("promo") === "1";
  const sort = (params.get("orden") as SortKey) in SORTS ? (params.get("orden") as SortKey) : "relevancia";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Estado local para que escribir en el buscador sea fluido aunque la URL tarde en actualizarse.
  const [search, setSearch] = useState(q);
  useEffect(() => {
    if (q === "") setSearch("");
  }, [q]);

  const clearAll = () => {
    setSearch("");
    router.replace(pathname, { scroll: false });
  };

  const brandMap = useMemo(() => Object.fromEntries(brands.map((b) => [b.slug, b])), [brands]);

  // Opciones calculadas a partir de los productos visibles en este contexto.
  const scope = lockedBrand ? products.filter((p) => p.brandSlug === lockedBrand) : products;
  const categories = Array.from(new Set(scope.map((p) => p.category)));
  const sizes = sortSizes(Array.from(new Set(scope.flatMap((p) => p.sizes.map((s) => s.size)))));
  const colors = Array.from(new Set(scope.flatMap((p) => p.colors.map((c) => c.name)))).sort();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = scope.filter(
      (p) =>
        (!brand || p.brandSlug === brand) &&
        (!category || p.category === category) &&
        (!size || p.sizes.some((s) => s.size === size && (!onlyAvailable || s.stock > 0))) &&
        (!color || p.colors.some((c) => c.name === color)) &&
        (!onlyAvailable || !isSoldOut(p)) &&
        (!onlyPromo || !!p.compareAtPrice) &&
        (!term ||
          `${p.name} ${p.category} ${brandMap[p.brandSlug]?.name ?? ""}`.toLowerCase().includes(term))
    );
    switch (sort) {
      case "nuevo":
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case "precio-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "precio-desc":
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
  }, [scope, brand, category, size, color, onlyAvailable, onlyPromo, q, sort, brandMap]);

  const activeFilters = [!lockedBrand && brand, category, size, color, onlyAvailable, onlyPromo, q].filter(Boolean).length;

  return (
    <div className="catalog">
      <div className="filters" role="search" aria-label="Filtros del catálogo">
        <label className="filter-search">
          Buscar
          <input
            type="search"
            placeholder="Hoodie, jean, Nómada…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParam("q", e.target.value);
            }}
          />
        </label>
        {!lockedBrand && (
          <label>
            Marca
            <select value={brand} onChange={(e) => setParam("marca", e.target.value)}>
              <option value={ALL}>Todas</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Categoría
          <select value={category} onChange={(e) => setParam("categoria", e.target.value)}>
            <option value={ALL}>Todas</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Talla
          <select value={size} onChange={(e) => setParam("talla", e.target.value)}>
            <option value={ALL}>Todas</option>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Color
          <select value={color} onChange={(e) => setParam("color", e.target.value)}>
            <option value={ALL}>Todos</option>
            {colors.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Ordenar
          <select value={sort} onChange={(e) => setParam("orden", e.target.value === "relevancia" ? "" : e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setParam("disponible", e.target.checked ? "1" : "")}
          />
          Solo disponibles
        </label>
        <label className="filter-check">
          <input type="checkbox" checked={onlyPromo} onChange={(e) => setParam("promo", e.target.checked ? "1" : "")} />
          En promoción
        </label>
      </div>

      <div className="catalog-meta">
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
        </span>
        {activeFilters > 0 && (
          <button className="link-button" onClick={clearAll}>
            Limpiar filtros ({activeFilters})
          </button>
        )}
      </div>

      <div className="catalog-grid">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} brand={brandMap[p.brandSlug]} hideBrand={!!lockedBrand} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No encontramos productos con esos filtros.</p>
            <button className="link-button" onClick={clearAll}>
              Ver todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
