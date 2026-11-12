import type { Metadata } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getBrands } from "@/lib/catalog";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ROJI — Streetwear independiente de Bogotá", template: "%s · ROJI" },
  description: site.description,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brands = (await getBrands()).map(({ slug, name }) => ({ slug, name }));

  return (
    <html lang="es" className={`${manrope.variable} ${dmMono.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header brands={brands} />
        <main id="contenido">{children}</main>
        <Footer brands={brands} />
      </body>
    </html>
  );
}
