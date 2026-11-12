import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Catalog from "@/components/Catalog";
import { getBrand, getBrands, getProductsByBrand } from "@/lib/catalog";
import { money } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrand((await params).slug);
  if (!brand) return { title: "Marca no encontrada" };
  return { title: brand.name, description: `${brand.tagline} ${brand.description}` };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const [products, brands] = await Promise.all([getProductsByBrand(slug), getBrands()]);
  const prices = products.map((p) => p.price);

  return (
    <>
      <section
        className="brand-hero"
        style={{
          ["--brand-accent" as string]: brand.accent,
          ...(brand.coverImage ? { backgroundImage: `url(${brand.coverImage})` } : {}),
        }}
      >
        <nav className="breadcrumb" aria-label="Ruta">
          <Link href="/">Inicio</Link> / <Link href="/marcas">Marcas</Link> / <span>{brand.name}</span>
        </nav>
        <div className="brand-hero-copy">
          <p className="eyebrow">{brand.style}</p>
          <h1>{brand.name}</h1>
          <p className="brand-tagline">{brand.tagline}</p>
        </div>
      </section>

      <section className="section brand-about">
        <p className="brand-description">{brand.description}</p>
        <dl className="brand-facts">
          <div>
            <dt>Desde</dt>
            <dd>{brand.founded}</dd>
          </div>
          <div>
            <dt>Ciudad</dt>
            <dd>{brand.city}</dd>
          </div>
          <div>
            <dt>Piezas</dt>
            <dd>{products.length}</dd>
          </div>
          {prices.length > 0 && (
            <div>
              <dt>Precios</dt>
              <dd>
                {money(Math.min(...prices))} – {money(Math.max(...prices))}
              </dd>
            </div>
          )}
          {brand.instagram && (
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer">
                  @{brand.instagram} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="section catalog-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Colección</p>
            <h2>
              Todo de <em>{brand.name}.</em>
            </h2>
          </div>
        </div>
        <Suspense fallback={<p className="loading">Cargando productos…</p>}>
          <Catalog products={products} brands={brands} lockedBrand={brand.slug} />
        </Suspense>
      </section>
    </>
  );
}
