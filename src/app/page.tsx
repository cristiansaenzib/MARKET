import Link from "next/link";
import BrandCard from "@/components/BrandCard";
import ProductCard from "@/components/ProductCard";
import { getBrandMap, getBrands, getFeaturedProducts, getProducts } from "@/lib/catalog";

export default async function Home() {
  const [brands, brandMap, featured, all] = await Promise.all([
    getBrands(),
    getBrandMap(),
    getFeaturedProducts(4),
    getProducts(),
  ]);
  const newest = all.slice(0, 4);
  const promos = all.filter((p) => p.compareAtPrice);
  const countByBrand = (slug: string) => all.filter((p) => p.brandSlug === slug).length;

  return (
    <>
      <section className="hero" aria-label="Campaña principal">
        <div className="hero-copy">
          <p className="eyebrow">Streetwear independiente · Bogotá</p>
          <h1>
            La calle
            <br />
            <em>tiene identidad.</em>
          </h1>
          <p className="hero-description">
            {brands.length} marcas locales, un solo lugar. Explora cada marca o encuentra tu pieza en el catálogo
            completo.
          </p>
          <div className="hero-actions">
            <Link className="light-button" href="/catalogo">
              Ver catálogo <span>↗</span>
            </Link>
            <Link className="ghost-button" href="/marcas">
              Conocer las marcas
            </Link>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Marcas en ROJI">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} aria-hidden={copy === 1}>
              {brands.map((b) => (
                <span key={b.slug}>
                  {b.name.toUpperCase()} <b>✳</b>{" "}
                </span>
              ))}
              {brands.map((b) => (
                <span key={`${b.slug}-2`}>
                  {b.name.toUpperCase()} <b>✳</b>{" "}
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selección ROJI</p>
            <h2>
              Los que están
              <br />
              <em>marcando la calle.</em>
            </h2>
          </div>
          <Link className="text-link" href="/catalogo">
            Ver todo el catálogo ↗
          </Link>
        </div>
        <div className="product-rail">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} brand={brandMap[p.brandSlug]} />
          ))}
        </div>
      </section>

      <section className="section brands-section" id="marcas">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gente que hace la calle</p>
            <h2>
              Marcas con
              <br />
              <em>algo que decir.</em>
            </h2>
          </div>
          <p className="section-note">Cada marca tiene su propio espacio, su historia y su colección completa.</p>
        </div>
        <div className="brand-grid">
          {brands.map((b, i) => (
            <BrandCard key={b.slug} brand={b} index={i} productCount={countByBrand(b.slug)} />
          ))}
        </div>
      </section>

      {promos.length > 0 && (
        <section className="promo-section">
          <div className="promo-image">
            <div className="promo-stamp">
              ROJI
              <br />
              PROMO
              <br />/ {promos.length}
            </div>
            <p>
              DROP
              <br />
              <em>01—26</em>
            </p>
          </div>
          <div className="promo-copy">
            <p className="eyebrow">Precios especiales</p>
            <h2>
              Encuentra tu
              <br />
              <em>propio código.</em>
            </h2>
            <p>
              {promos.length} piezas con descuento de marcas como{" "}
              {Array.from(new Set(promos.map((p) => brandMap[p.brandSlug]?.name))).join(" y ")}.
            </p>
            <Link className="dark-button" href="/catalogo?promo=1">
              Ver promociones <span>↗</span>
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recién llegados</p>
            <h2>
              Lo <em>nuevo.</em>
            </h2>
          </div>
          <Link className="text-link" href="/catalogo?orden=nuevo">
            Ver novedades ↗
          </Link>
        </div>
        <div className="product-rail">
          {newest.map((p) => (
            <ProductCard key={p.slug} product={p} brand={brandMap[p.brandSlug]} />
          ))}
        </div>
      </section>
    </>
  );
}
