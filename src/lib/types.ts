// Tipos del marketplace. Están pensados para mapear 1:1 con tablas de base de datos
// (por ejemplo Supabase: brands, products, product_variants) cuando se conecte el backend.

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  style: string;
  description: string;
  founded: number;
  city: string;
  instagram?: string;
  /** Color de acento de la marca, usado en su portada y tarjetas. */
  accent: string;
  /** Imagen de portada (URL). Si no existe se usa un fondo generado. */
  coverImage?: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type SizeStock = {
  size: string;
  stock: number;
};

export type ProductSpecs = {
  material: string;
  fit: string;
  weight?: string;
  origin: string;
  care: string[];
};

export type Product = {
  slug: string;
  name: string;
  brandSlug: string;
  category: Category;
  price: number;
  /** Precio antes de descuento, si el producto está en promoción. */
  compareAtPrice?: number;
  label?: string;
  description: string;
  highlights: string[];
  colors: ProductColor[];
  sizes: SizeStock[];
  specs: ProductSpecs;
  /** URLs de fotos. Si está vacío se muestran vistas generadas. */
  images: string[];
  featured?: boolean;
  createdAt: string; // ISO date
};

export const CATEGORIES = [
  "Camisetas",
  "Hoodies",
  "Chaquetas",
  "Pantalones",
  "Jeans",
  "Accesorios",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Única"];
