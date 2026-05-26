"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/supabase/types";

type Props = {
  product: Pick<Product, "id" | "slug" | "brand" | "name" | "price" | "image_url" | "stock">;
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={outOfStock}
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
      className="mt-6 flex min-h-[56px] w-full items-center justify-center rounded-full bg-ink text-sm font-semibold uppercase tracking-widest text-white transition-transform active:scale-[0.98] hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/30 sm:w-auto sm:px-12"
    >
      {outOfStock ? "Esgotado" : "Adicionar à sacola"}
    </button>
  );
}
