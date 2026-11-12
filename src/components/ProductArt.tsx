import type { Category, Product } from "@/lib/types";

// Vista del producto. Si el producto tiene fotos, muestra la foto; si no,
// dibuja una silueta de la prenda en el color seleccionado (marcador temporal).

const SILHOUETTES: Record<Category, string> = {
  Camisetas: "M60 20 L85 12 Q100 26 115 12 L140 20 L178 52 L160 80 L142 70 L142 200 L58 200 L58 70 L40 80 L22 52 Z",
  Hoodies:
    "M64 32 Q100 -6 136 32 L170 58 L186 172 L164 176 L148 92 L148 200 L52 200 L52 92 L36 176 L14 172 L30 58 Z",
  Chaquetas:
    "M66 22 L88 14 L100 30 L112 14 L134 22 L172 54 L186 176 L164 180 L150 96 L150 202 L50 202 L50 96 L36 180 L14 176 L28 54 Z",
  Pantalones: "M58 14 L142 14 L154 206 L112 206 L100 82 L88 206 L46 206 Z",
  Jeans: "M58 14 L142 14 L156 206 L112 206 L100 82 L88 206 L44 206 Z",
  Accesorios: "M46 86 L154 86 L164 204 L36 204 Z M74 86 Q74 36 100 36 Q126 36 126 86 L116 86 Q116 48 100 48 Q84 48 84 86 Z",
};

const DETAILS: Partial<Record<Category, string>> = {
  Hoodies: "M76 150 L124 150 L130 182 L70 182 Z",
  Chaquetas: "M100 30 L100 202 M62 110 L86 110 M114 110 L138 110",
  Jeans: "M58 34 L142 34 M70 34 Q74 54 90 56",
};

/** Devuelve true si el color es claro (para elegir el color del texto encima). */
function isLight(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

type Props = {
  product: Product;
  colorHex?: string;
  /** Índice de la vista (0 = frente). Cambia el encuadre del marcador. */
  view?: number;
  caption?: string;
  priority?: boolean;
};

export default function ProductArt({ product, colorHex, view = 0, caption, priority }: Props) {
  const image = product.images[view] ?? (view === 0 ? product.images[0] : undefined);
  const hex = colorHex ?? product.colors[0]?.hex ?? "#888";

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- cambiar a next/image cuando el dominio de fotos esté definido
      <img
        className="art-photo"
        src={image}
        alt={`${product.name}${caption ? ` — ${caption}` : ""}`}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  const zoom = [1, 1, 1.9, 1.35][view % 4];
  const flip = view === 1;
  const stroke = isLight(hex) ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.22)";

  return (
    <div className="art-placeholder" role="img" aria-label={`${product.name}${caption ? ` — ${caption}` : ""}`}>
      <svg
        viewBox="0 0 200 220"
        style={{ transform: `scale(${zoom}) ${flip ? "scaleX(-1)" : ""}` }}
        aria-hidden="true"
      >
        <path d={SILHOUETTES[product.category]} fill={hex} stroke={stroke} strokeWidth="1.2" fillRule="evenodd" />
        {DETAILS[product.category] && (
          <path d={DETAILS[product.category]} fill="none" stroke={stroke} strokeWidth="1.4" />
        )}
      </svg>
      {caption && <span className="art-caption">{caption}</span>}
    </div>
  );
}
