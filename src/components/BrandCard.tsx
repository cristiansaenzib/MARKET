import Link from "next/link";
import type { Brand } from "@/lib/types";

type Props = { brand: Brand; index: number; productCount: number };

export default function BrandCard({ brand, index, productCount }: Props) {
  return (
    <Link
      href={`/marcas/${brand.slug}`}
      className="brand-card"
      style={{ ["--brand-accent" as string]: brand.accent }}
    >
      <span className="brand-number">
        {String(index + 1).padStart(2, "0")} / {productCount} piezas
      </span>
      <span className="brand-name">{brand.name}</span>
      <span className="brand-style">{brand.style}</span>
      <span className="brand-open">Ver marca ↗</span>
    </Link>
  );
}
