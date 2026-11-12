import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductView from "@/components/ProductView";
import { getBrand, getBrandMap, getProduct, getProducts, getRelated } from "@/lib/catalog";
import { sizeGuide, site } from "@/lib/site";
import { isSoldOut, sortSizes } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Producto no encontrado" };
  const brand = await getBrand(product.brandSlug);
  return {
    title: `${product.name} — ${brand?.name ?? ""}`,
    description: product.description,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const brand = await getBrand(product.brandSlug);
  if (!brand) notFound();

  const [{ sameBrand, sameCategory }, brandMap] = await Promise.all([getRelated(product), getBrandMap()]);
  const { specs } = product;
  const isBottom = product.category === "Pantalones" || product.category === "Jeans";
  const hasSizeGuide = product.category !== "Accesorios";
  const guide = isBottom ? sizeGuide.bottoms : sizeGuide.tops;
  const available = sortSizes(product.sizes.filter((s) => s.stock > 0).map((s) => s.size));

  // Datos estructurados para que Google muestre precio y disponibilidad.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: brand.name },
    category: product.category,
    material: specs.material,
    color: product.colors.map((c) => c.name).join(", "),
    ...(product.images.length ? { image: product.images } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.price,
      availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section page-top pdp-wrap">
        <nav className="breadcrumb" aria-label="Ruta">
          <Link href="/">Inicio</Link> / <Link href="/marcas">Marcas</Link> /{" "}
          <Link href={`/marcas/${brand.slug}`}>{brand.name}</Link> / <span>{product.name}</span>
        </nav>

        <ProductView product={product} brand={brand} />

        {/* ── Todo lo referente al producto ─────────────────── */}
        <div className="pdp-details">
          <details open>
            <summary>Especificaciones</summary>
            <dl className="spec-table">
              <div>
                <dt>Marca</dt>
                <dd>
                  <Link href={`/marcas/${brand.slug}`}>{brand.name}</Link>
                </dd>
              </div>
              <div>
                <dt>Categoría</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Material</dt>
                <dd>{specs.material}</dd>
              </div>
              <div>
                <dt>{product.category === "Accesorios" ? "Medidas" : "Ajuste"}</dt>
                <dd>{specs.fit}</dd>
              </div>
              {specs.weight && (
                <div>
                  <dt>Gramaje</dt>
                  <dd>{specs.weight}</dd>
                </div>
              )}
              <div>
                <dt>Colores</dt>
                <dd>{product.colors.map((c) => c.name).join(", ")}</dd>
              </div>
              <div>
                <dt>Tallas disponibles</dt>
                <dd>{available.length ? available.join(" · ") : "Agotado"}</dd>
              </div>
              <div>
                <dt>Origen</dt>
                <dd>{specs.origin}</dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd className="mono">{product.slug.toUpperCase()}</dd>
              </div>
            </dl>
          </details>

          {hasSizeGuide && (
            <details>
              <summary>Guía de tallas</summary>
              <p className="details-note">Medidas de la prenda en centímetros, tomada en plano. Ajuste: {specs.fit.toLowerCase()}.</p>
              <div className="table-scroll">
                <table className="size-table">
                  <thead>
                    <tr>
                      {guide.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.rows
                      .filter((r) => product.sizes.some((s) => s.size === r[0]))
                      .map((r) => (
                        <tr key={r[0]}>
                          {r.map((c, i) => (i === 0 ? <th key={i}>{c}</th> : <td key={i}>{c}</td>))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          <details>
            <summary>Cuidado de la prenda</summary>
            <ul>
              {specs.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>

          <details>
            <summary>Envíos</summary>
            <ul>
              {site.shipping.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </details>

          <details>
            <summary>Cambios y devoluciones</summary>
            <ul>
              {site.returns.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </details>
        </div>

        <aside className="pdp-brand-card" style={{ ["--brand-accent" as string]: brand.accent }}>
          <div>
            <p className="eyebrow">Sobre la marca</p>
            <h2>{brand.name}</h2>
            <p>{brand.description}</p>
          </div>
          <Link className="light-button" href={`/marcas/${brand.slug}`}>
            Ver toda la marca <span>↗</span>
          </Link>
        </aside>
      </div>

      {sameBrand.length > 0 && (
        <section className="section related">
          <div className="section-heading">
            <h2 className="related-title">
              Más de <em>{brand.name}</em>
            </h2>
            <Link className="text-link" href={`/marcas/${brand.slug}`}>
              Ver todo ↗
            </Link>
          </div>
          <div className="product-rail">
            {sameBrand.map((p) => (
              <ProductCard key={p.slug} product={p} hideBrand />
            ))}
          </div>
        </section>
      )}

      {sameCategory.length > 0 && (
        <section className="section related">
          <div className="section-heading">
            <h2 className="related-title">
              {product.category} de <em>otras marcas</em>
            </h2>
            <Link className="text-link" href={`/catalogo?categoria=${encodeURIComponent(product.category)}`}>
              Ver categoría ↗
            </Link>
          </div>
          <div className="product-rail">
            {sameCategory.map((p) => (
              <ProductCard key={p.slug} product={p} brand={brandMap[p.brandSlug]} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
