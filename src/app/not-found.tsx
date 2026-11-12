import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-top not-found">
      <p className="eyebrow">Error 404</p>
      <h1 className="page-title">
        Esto no está <em>en la calle.</em>
      </h1>
      <p className="section-note">La página que buscas no existe o el producto ya no está disponible.</p>
      <div className="hero-actions">
        <Link className="dark-button" href="/catalogo">
          Ir al catálogo <span>↗</span>
        </Link>
        <Link className="text-link" href="/marcas">
          Ver marcas
        </Link>
      </div>
    </section>
  );
}
