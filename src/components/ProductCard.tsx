"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, productImageUrl, type Product } from "@/lib/supabase/types";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  product: Pick<
    Product,
    "id" | "slug" | "brand" | "name" | "price" | "image_url"
  > & { category?: { name: string } | null };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col">
      <Link
        href={`/produto/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-blush"
      >
        <ProductImage
          src={productImageUrl(product)}
          alt={product.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ink/70 backdrop-blur-sm">
            {product.category.name}
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col px-1">
        <Link href={`/produto/${product.slug}`} className="flex-1">
          <p className="text-xs font-bold tracking-wide text-ink">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-sm leading-snug text-ink/80">
            {product.name}
          </h3>
          <p className="mt-2 text-base font-medium text-ink">
            {formatPrice(product.price)}
          </p>
        </Link>

        <button
          type="button"
          onClick={() =>
            addItem({
              id: product.id,
              slug: product.slug,
              brand: product.brand,
              name: product.name,
              price: product.price,
              image_url: product.image_url ?? null,
            })
          }
          className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full border border-ink/15 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white active:scale-[0.98]"
        >
          Adicionar
        </button>
      </div>
    </article>
  );
}
