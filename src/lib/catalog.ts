import { brands, products } from "./data";
import type { Brand, Product } from "./types";

// Capa de acceso a datos. Hoy lee de `data.ts`; mañana estas mismas funciones
// pueden consultar Supabase (u otra base) sin tocar las páginas.
// Son async a propósito, para que el cambio a una base real no rompa nada.

export async function getBrands(): Promise<Brand[]> {
  return brands;
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  return brands.find((b) => b.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.brandSlug === brandSlug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured).slice(0, limit);
}

/** Productos de la misma marca y, aparte, de la misma categoría en otras marcas. */
export async function getRelated(product: Product, limit = 4) {
  const all = await getProducts();
  const sameBrand = all.filter((p) => p.brandSlug === product.brandSlug && p.slug !== product.slug).slice(0, limit);
  const sameCategory = all
    .filter((p) => p.category === product.category && p.brandSlug !== product.brandSlug)
    .slice(0, limit);
  return { sameBrand, sameCategory };
}

export async function getBrandMap(): Promise<Record<string, Brand>> {
  return Object.fromEntries((await getBrands()).map((b) => [b.slug, b]));
}
