"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "./ProductImage";
import { formatPrice, productImageUrl, type Product } from "@/lib/supabase/types";

type SearchBarProps = {
  onClose?: () => void;
  autoFocus?: boolean;
};

export function SearchBar({ onClose, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (active) setResults(json.results ?? []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar marca, produto ou categoria..."
          className="w-full rounded-full border border-ink/10 bg-white py-4 pl-12 pr-12 text-base text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          aria-label="Buscar produtos"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5"
            aria-label="Limpar busca"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {query.trim().length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(70vh,400px)] overflow-y-auto rounded-2xl border border-ink/10 bg-white shadow-xl"
          role="listbox"
        >
          {loading && results.length === 0 ? (
            <li className="px-5 py-6 text-center text-sm text-ink/50">Buscando...</li>
          ) : results.length === 0 ? (
            <li className="px-5 py-6 text-center text-sm text-ink/50">
              Nenhum produto encontrado para &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((product) => (
              <li key={product.id} role="option" aria-selected={false}>
                <Link
                  href={`/produto/${product.slug}`}
                  onClick={onClose}
                  className="flex min-h-[72px] items-center gap-4 px-4 py-3 transition-colors hover:bg-blush active:bg-blush"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <ProductImage
                      src={productImageUrl(product)}
                      alt={product.name}
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold tracking-wide text-ink">
                      {product.brand}
                    </p>
                    <p className="truncate text-sm text-ink/70">{product.name}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-ink">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
