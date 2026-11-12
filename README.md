# ROJI — marketplace de marcas de streetwear

Tienda multimarca en Next.js (App Router) + TypeScript + CSS propio.

## Arrancar

```bash
npm install
cp .env.example .env.local   # pon aquí el número de WhatsApp de ROJI
npm run dev
```

Abre http://localhost:3000

## Páginas

| Ruta | Qué muestra |
|---|---|
| `/` | Inicio: hero, destacados, marcas, promociones y novedades |
| `/catalogo` | **Catálogo global** con los productos de todas las marcas. Filtros por búsqueda, marca, categoría, talla, color, disponibilidad y promoción; orden por destacados, novedad o precio. Los filtros quedan en la URL (`/catalogo?categoria=Hoodies&talla=M`), así que se pueden compartir |
| `/marcas` | Directorio de marcas |
| `/marcas/[slug]` | **Apartado de cada marca**: portada con su color, historia, datos (año, ciudad, rango de precios, Instagram) y su colección con los mismos filtros |
| `/producto/[slug]` | **Página de producto**: galería con vistas, selector de color y talla con existencias por talla, cantidad, pedido por WhatsApp con el detalle ya escrito, especificaciones, guía de tallas, cuidados, envíos, cambios, ficha de la marca, "Más de esta marca" y "De otras marcas" |

Si un producto o marca no existe, se muestra una página 404 propia.

## Estructura

```
src/
  app/                    rutas (cada carpeta = una URL)
  components/             Header, Footer, Catalog, ProductCard, ProductView, ProductArt, BrandCard
  lib/
    types.ts              tipos Brand y Product
    data.ts               ← DATOS DE EJEMPLO: marcas y productos
    catalog.ts            funciones de acceso a datos (getProducts, getBrand…)
    site.ts               textos de envíos, cambios, beneficios y guía de tallas
    utils.ts              formato de precios, stock, enlace de WhatsApp
```

## Cómo agregar una marca o un producto

Agrégalo en `src/lib/data.ts`. La marca aparece automáticamente en el menú, en el footer, en `/marcas` y con su propia página; el producto aparece en el catálogo global, en el apartado de su marca y con su propia página.

- **Fotos:** llena `images: ["https://…/frente.jpg", "https://…/espalda.jpg", …]`. Mientras esté vacío se dibuja una silueta de la prenda en el color seleccionado.
- **Existencias:** `sizes: [{ size: "M", stock: 4 }]`. Con `stock: 0` la talla aparece tachada; si todo está en 0, el producto se marca como agotado.
- **Promoción:** pon `compareAtPrice` (precio anterior) y se calcula el descuento.

## Conectar una base de datos

Toda la app lee los datos a través de `src/lib/catalog.ts`. Para pasar a una base real (por ejemplo Supabase) solo hay que reescribir esas funciones; las páginas no cambian. Los tipos de `types.ts` se pueden convertir en tablas `brands`, `products` y `product_sizes`.

## Pendiente

- Marcas, productos, precios, políticas de envío y cambios son **datos de ejemplo**.
- Las 2 imágenes del inicio son referencias de Unsplash: reemplázalas por fotos propias.
- No hay carrito, pagos, cuentas de usuario ni panel de administración; el pedido se cierra por WhatsApp.
