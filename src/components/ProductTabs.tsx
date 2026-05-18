"use client";

import { useState } from "react";
import type { Product, Review } from "@/types/product";

const tabs = [
  { id: "uso", label: "Como Usar" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "avaliacoes", label: "Avaliações" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type ProductTabsProps = {
  product: Product;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-none stroke-current"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border-b border-ink/10 py-5 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{review.author}</p>
        <time className="text-xs text-ink/40" dateTime={review.date}>
          {new Date(review.date).toLocaleDateString("pt-BR")}
        </time>
      </div>
      <div className="mt-2">
        <StarRating rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">{review.comment}</p>
    </article>
  );
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>("uso");
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div>
      <div
        className="flex gap-1 overflow-x-auto no-scrollbar border-b border-ink/10"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
              active === tab.id
                ? "border-b-2 border-ink text-ink"
                : "text-ink/40 hover:text-ink/70"
            }`}
          >
            {tab.label}
            {tab.id === "avaliacoes" && product.reviews.length > 0 && (
              <span className="ml-1.5 text-ink/40">({product.reviews.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-1 py-6" role="tabpanel">
        {active === "uso" && (
          <p className="text-sm leading-relaxed text-ink/80">{product.howToUse}</p>
        )}
        {active === "ingredientes" && (
          <p className="text-sm leading-relaxed text-ink/80">{product.ingredients}</p>
        )}
        {active === "avaliacoes" && (
          <div>
            {product.reviews.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm text-ink/60">
                  {avgRating.toFixed(1)} · {product.reviews.length}{" "}
                  {product.reviews.length === 1 ? "avaliação" : "avaliações"}
                </span>
              </div>
            )}
            {product.reviews.length === 0 ? (
              <p className="text-sm text-ink/50">Ainda não há avaliações para este produto.</p>
            ) : (
              product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
