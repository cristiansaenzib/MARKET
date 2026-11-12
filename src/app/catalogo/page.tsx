import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/Catalog";
import { getBrands, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Todas las prendas de las marcas independientes de ROJI en un solo catálogo.",
};

export default async function CatalogPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  return (
    <section className="section page-top">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {brands.length} marcas · {products.length} productos
          </p>
          <h1 className="page-title">
            Catálogo <em>ROJI.</em>
          </h1>
        </div>
        <p className="section-note">Todas las marcas en un solo lugar. Filtra por marca, categoría, talla o color.</p>
      </div>
      {/* useSearchParams necesita un límite de Suspense para el renderizado estático */}
      <Suspense fallback={<p className="loading">Cargando catálogo…</p>}>
        <Catalog products={products} brands={brands} />
      </Suspense>
    </section>
  );
}
