"use client";

import { useState } from "react";
import type { Review } from "@/lib/supabase/types";

const tabs = [
  { id: "uso", label: "Como Usar" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "avaliacoes", label: "Avaliações" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type ProductTabsProps = {
  howToUse: string | null;
  ingredients: string | null;
  reviews: Review[];
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
        <time className="text-xs text-ink/40" dateTime={review.created_at}>
          {new Date(review.created_at).toLocaleDateString("pt-BR")}
        </time>
      </div>
      <div className="mt-2">
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{review.comment}</p>
      )}
    </article>
  );
}

export function ProductTabs({ howToUse, ingredients, reviews }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>("uso");
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
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
            {tab.id === "avaliacoes" && reviews.length > 0 && (
              <span className="ml-1.5 text-ink/40">({reviews.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-1 py-6" role="tabpanel">
        {active === "uso" && (
          <p className="text-sm leading-relaxed text-ink/80">
            {howToUse || "Sem instruções de uso cadastradas."}
          </p>
        )}
        {active === "ingredientes" && (
          <p className="text-sm leading-relaxed text-ink/80">
            {ingredients || "Lista de ingredientes não disponível."}
          </p>
        )}
        {active === "avaliacoes" && (
          <div>
            {reviews.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm text-ink/60">
                  {avgRating.toFixed(1)} · {reviews.length}{" "}
                  {reviews.length === 1 ? "avaliação" : "avaliações"}
                </span>
              </div>
            )}
            {reviews.length === 0 ? (
              <p className="text-sm text-ink/50">
                Ainda não há avaliações para este produto.
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
