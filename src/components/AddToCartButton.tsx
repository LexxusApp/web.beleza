"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="mt-6 flex min-h-[56px] w-full items-center justify-center rounded-full bg-ink text-sm font-semibold uppercase tracking-widest text-white transition-transform active:scale-[0.98] hover:bg-ink/90 sm:w-auto sm:px-12"
    >
      Adicionar à sacola
    </button>
  );
}
