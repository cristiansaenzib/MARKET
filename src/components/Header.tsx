"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Brand } from "@/lib/types";

type Props = { brands: Pick<Brand, "slug" | "name">[] };

export default function Header({ brands }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar el menú móvil al navegar.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="header-bar">
        <Link className="wordmark" href="/" aria-label="ROJI, inicio">
          ROJI<span>®</span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/catalogo" aria-current={isActive("/catalogo") ? "page" : undefined}>
            Catálogo
          </Link>
          <div className="nav-dropdown">
            <Link href="/marcas" aria-current={isActive("/marcas") ? "page" : undefined}>
              Marcas <span aria-hidden="true">▾</span>
            </Link>
            <div className="nav-dropdown-panel">
              {brands.map((b) => (
                <Link key={b.slug} href={`/marcas/${b.slug}`}>
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/catalogo?orden=nuevo">Novedades</Link>
        </nav>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      <nav id="mobile-menu" className="mobile-nav" aria-label="Navegación móvil" hidden={!open}>
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/catalogo?orden=nuevo">Novedades</Link>
        <Link href="/marcas">Todas las marcas</Link>
        <div className="mobile-nav-brands">
          {brands.map((b) => (
            <Link key={b.slug} href={`/marcas/${b.slug}`}>
              {b.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
