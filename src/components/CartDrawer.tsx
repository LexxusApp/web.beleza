"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ProductImage } from "./ProductImage";
import { useCart } from "@/context/CartContext";
import { formatPrice, productImageUrl } from "@/lib/supabase/types";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 animate-fade-in"
        onClick={closeCart}
        aria-label="Fechar carrinho"
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl animate-slide-in-right"
        role="dialog"
        aria-label="Carrinho de compras"
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-xl tracking-wide">
            Sacola
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-sans font-normal text-ink/50">
                ({totalItems})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-ink/5"
            aria-label="Fechar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <svg className="mb-4 h-16 w-16 text-ink/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z" />
              </svg>
              <p className="text-sm text-ink/50">Sua sacola está vazia</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 min-h-[48px] rounded-full bg-ink px-8 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4">
                  <Link
                    href={`/produto/${product.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-blush"
                  >
                    <ProductImage
                      src={productImageUrl(product)}
                      alt={product.name}
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-xs font-bold tracking-wide">{product.brand}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-ink/70">{product.name}</p>
                    <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>

                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="flex h-11 w-11 items-center justify-center text-lg"
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="flex h-11 w-11 items-center justify-center text-lg"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-xs text-ink/40 underline-offset-2 hover:text-ink hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-ink/10 px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm uppercase tracking-widest text-ink/60">Subtotal</span>
              <span className="text-lg font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-ink text-sm font-semibold uppercase tracking-widest text-white transition-transform active:scale-[0.98] hover:bg-ink/90"
            >
              Finalizar compra
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 flex min-h-[48px] w-full items-center justify-center text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
            >
              Continuar comprando
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
