import type { Metadata } from "next";
import BrandCard from "@/components/BrandCard";
import { getBrands, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Conoce las marcas independientes de streetwear que hacen parte de ROJI.",
};

export default async function BrandsPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);

  return (
    <section className="section page-top">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{brands.length} marcas independientes</p>
          <h1 className="page-title">
            Las <em>marcas.</em>
          </h1>
        </div>
        <p className="section-note">Una plataforma, diferentes identidades. Entra a cada marca para ver su historia y su colección.</p>
      </div>
      <div className="brand-grid">
        {brands.map((b, i) => (
          <BrandCard
            key={b.slug}
            brand={b}
            index={i}
            productCount={products.filter((p) => p.brandSlug === b.slug).length}
          />
        ))}
      </div>
    </section>
  );
}
