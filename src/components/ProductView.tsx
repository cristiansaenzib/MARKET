"use client";

import Link from "next/link";
import { useState } from "react";
import type { Brand, Product } from "@/lib/types";
import { discountPercent, isSoldOut, money, sortSizes, whatsappUrl } from "@/lib/utils";
import { site } from "@/lib/site";
import ProductArt from "./ProductArt";

const VIEWS = ["Frente", "Espalda", "Detalle", "Ajuste"];
const LOW_STOCK = 3;

type Props = { product: Product; brand: Brand };

export default function ProductView({ product, brand }: Props) {
  const [colorIndex, setColorIndex] = useState(0);
  const [view, setView] = useState(0);
  const [size, setSize] = useState<string | null>(
    // Si solo hay una talla (p. ej. "Única") se selecciona sola.
    product.sizes.length === 1 && product.sizes[0].stock > 0 ? product.sizes[0].size : null
  );
  const [qty, setQty] = useState(1);

  const color = product.colors[colorIndex];
  const sizeOrder = sortSizes(product.sizes.map((s) => s.size));
  const sizes = sizeOrder.map((s) => product.sizes.find((x) => x.size === s)!);
  const selected = sizes.find((s) => s.size === size);
  const soldOut = isSoldOut(product);
  const discount = discountPercent(product);
  const viewCount = Math.max(product.images.length, VIEWS.length);

  const message = [
    `Hola ROJI, quiero pedir este producto:`,
    ``,
    `• ${product.name} — ${brand.name}`,
    `• Color: ${color.name}`,
    `• Talla: ${size ?? "por definir"}`,
    `• Cantidad: ${qty}`,
    `• Precio: ${money(product.price * qty)}`,
    ``,
    `Referencia: /producto/${product.slug}`,
  ].join("\n");

  const pickSize = (s: string) => {
    setSize(s);
    setQty(1);
  };

  return (
    <div className="pdp">
      {/* ── Galería ─────────────────────────────────────────── */}
      <div className="pdp-gallery">
        <div className="pdp-main-image">
          <ProductArt product={product} colorHex={color.hex} view={view} caption={VIEWS[view]} priority />
          {discount > 0 && <span className="product-label is-promo">−{discount}%</span>}
        </div>
        <div className="pdp-thumbs" role="tablist" aria-label="Vistas del producto">
          {Array.from({ length: viewCount }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={view === i}
              aria-label={VIEWS[i] ?? `Foto ${i + 1}`}
              className="pdp-thumb"
              onClick={() => setView(i)}
            >
              <ProductArt product={product} colorHex={color.hex} view={i} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Información y compra ────────────────────────────── */}
      <div className="pdp-info">
        <Link href={`/marcas/${brand.slug}`} className="pdp-brand">
          {brand.name} ↗
        </Link>
        <h1>{product.name}</h1>

        <p className="pdp-price">
          <strong>{money(product.price)}</strong>
          {product.compareAtPrice && (
            <>
              <s>{money(product.compareAtPrice)}</s>
              <span className="pdp-discount">Ahorras {money(product.compareAtPrice - product.price)}</span>
            </>
          )}
        </p>

        <p className="pdp-description">{product.description}</p>

        <ul className="pdp-highlights">
          {product.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {/* Color */}
        <fieldset className="pdp-option">
          <legend>
            Color: <b>{color.name}</b>
          </legend>
          <div className="color-options">
            {product.colors.map((c, i) => (
              <label key={c.name} className="color-option" title={c.name}>
                <input
                  type="radio"
                  name="color"
                  checked={i === colorIndex}
                  onChange={() => setColorIndex(i)}
                />
                <span style={{ background: c.hex }} />
                <span className="sr-only">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Talla */}
        <fieldset className="pdp-option">
          <legend>
            Talla: <b>{size ?? "Selecciona una"}</b>
          </legend>
          <div className="size-options">
            {sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                className="size-option"
                aria-pressed={size === s.size}
                disabled={s.stock === 0}
                onClick={() => pickSize(s.size)}
              >
                {s.size}
                {s.stock === 0 && <span className="sr-only"> (agotada)</span>}
              </button>
            ))}
          </div>
          <p className="stock-note" aria-live="polite">
            {soldOut
              ? "Este producto está agotado."
              : selected
                ? selected.stock <= LOW_STOCK
                  ? `¡Últimas ${selected.stock} unidades en talla ${selected.size}!`
                  : `Disponible en talla ${selected.size}.`
                : "Las tallas tachadas están agotadas."}
          </p>
        </fieldset>

        {/* Cantidad */}
        {selected && (
          <div className="pdp-option qty">
            <span className="qty-label">Cantidad</span>
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar uno">
                −
              </button>
              <output aria-live="polite">{qty}</output>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(selected.stock, q + 1))}
                aria-label="Sumar uno"
                disabled={qty >= selected.stock}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Acción */}
        {soldOut ? (
          <a
            className="buy-button is-secondary"
            href={whatsappUrl(`Hola ROJI, quiero saber cuándo vuelve ${product.name} de ${brand.name}.`)}
            target="_blank"
            rel="noreferrer"
          >
            Avísame cuando vuelva ↗
          </a>
        ) : size ? (
          <a className="buy-button" href={whatsappUrl(message)} target="_blank" rel="noreferrer">
            Pedir por WhatsApp · {money(product.price * qty)} ↗
          </a>
        ) : (
          <button className="buy-button" type="button" disabled>
            Selecciona una talla
          </button>
        )}

        <ul className="pdp-perks">
          {site.perks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
