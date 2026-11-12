import Link from "next/link";
import type { Brand } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

export default function Footer({ brands }: { brands: Pick<Brand, "slug" | "name">[] }) {
  return (
    <footer className="footer">
      <div>
        <Link className="wordmark" href="/">
          ROJI<span>®</span>
        </Link>
        <p>
          Marcas independientes de streetwear en un solo lugar.
          <br />
          Bogotá, Colombia.
        </p>
      </div>
      <div className="footer-col">
        <p className="footer-title">Tienda</p>
        <Link href="/catalogo">Catálogo completo</Link>
        <Link href="/catalogo?orden=nuevo">Novedades</Link>
        <Link href="/marcas">Marcas</Link>
      </div>
      <div className="footer-col">
        <p className="footer-title">Marcas</p>
        {brands.map((b) => (
          <Link key={b.slug} href={`/marcas/${b.slug}`}>
            {b.name}
          </Link>
        ))}
      </div>
      <div className="footer-col">
        <p className="footer-title">Ayuda</p>
        <a href={whatsappUrl("Hola ROJI, necesito ayuda con un pedido.")} target="_blank" rel="noreferrer">
          Contacto por WhatsApp
        </a>
        <span>Envíos a toda Colombia</span>
        <span>Cambios hasta 15 días</span>
      </div>
      <small>© {new Date().getFullYear()} ROJI. Todos los derechos reservados.</small>
    </footer>
  );
}
