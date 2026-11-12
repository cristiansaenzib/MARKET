import type { Product } from "./types";
import { SIZE_ORDER } from "./types";

// Utilidades sin dependencias de servidor: se pueden usar en componentes cliente.

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const money = (value: number) => currency.format(value);

export const totalStock = (p: Product) => p.sizes.reduce((sum, s) => sum + s.stock, 0);

export const isSoldOut = (p: Product) => totalStock(p) === 0;

export const discountPercent = (p: Product) =>
  p.compareAtPrice && p.compareAtPrice > p.price
    ? Math.round((1 - p.price / p.compareAtPrice) * 100)
    : 0;

export const sortSizes = (sizes: string[]) =>
  [...sizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

/** Producto creado en los últimos 30 días respecto a la fecha dada. */
export const isNew = (p: Product, now = new Date()) =>
  now.getTime() - new Date(p.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

/**
 * Enlace de WhatsApp. El número se configura en `.env.local`:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567   (código de país, sin + ni espacios)
 */
export function whatsappUrl(message: string) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
