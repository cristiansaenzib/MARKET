import Link from "next/link";
import type { Brand, Product } from "@/lib/types";
import { discountPercent, isSoldOut, money } from "@/lib/utils";
import ProductArt from "./ProductArt";

type Props = {
  product: Product;
  brand?: Brand;
  /** Ocultar el nombre de la marca (útil dentro de la página de la marca). */
  hideBrand?: boolean;
};

export default function ProductCard({ product, brand, hideBrand }: Props) {
  const soldOut = isSoldOut(product);
  const discount = discountPercent(product);

  return (
    <article className={`product-card${soldOut ? " is-sold-out" : ""}`}>
      <Link href={`/producto/${product.slug}`} className="product-card-link">
        <div className="product-art">
          <ProductArt product={product} />
          {soldOut ? (
            <span className="product-label">Agotado</span>
          ) : discount > 0 ? (
            <span className="product-label is-promo">−{discount}%</span>
          ) : (
            product.label && <span className="product-label">{product.label}</span>
          )}
          {product.colors.length > 1 && (
            <span className="swatches" aria-label={`${product.colors.length} colores`}>
              {product.colors.map((c) => (
                <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.name} />
              ))}
            </span>
          )}
        </div>
        <div className="product-info">
          <div>
            {!hideBrand && brand && <p className="product-brand">{brand.name}</p>}
            <h3>{product.name}</h3>
          </div>
          <p className="product-price">
            <strong>{money(product.price)}</strong>
            {product.compareAtPrice && <s>{money(product.compareAtPrice)}</s>}
          </p>
        </div>
      </Link>
    </article>
  );
}
