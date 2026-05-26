"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/supabase/types";

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Sua sacola está vazia.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: fd.get("name"),
          customer_email: fd.get("email"),
          customer_phone: fd.get("phone"),
          shipping_address: fd.get("address"),
          notes: fd.get("notes"),
          items: items.map((i) => ({
            product_id: i.product.id,
            brand: i.product.brand,
            name: i.product.name,
            unit_price: i.product.price,
            quantity: i.quantity,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erro ao finalizar pedido.");
        return;
      }
      try {
        localStorage.removeItem("lumiere.cart.v1");
      } catch {}
      router.push(`/checkout/sucesso?id=${json.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6 lg:col-span-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
          Dados de entrega
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome completo" name="name" required />
          <Field label="E-mail" name="email" type="email" required />
        </div>
        <Field label="Telefone" name="phone" required />
        <Field label="Endereço completo" name="address" required textarea />
        <Field label="Observações" name="notes" textarea />
      </div>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
            Resumo
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.product.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {i.quantity}× {i.product.brand}
                </span>
                <span className="shrink-0">
                  {formatPrice(i.product.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
            <span className="text-sm uppercase tracking-widest text-ink/60">Total</span>
            <span className="text-lg font-medium">{formatPrice(totalPrice)}</span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || items.length === 0}
            className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-full bg-ink text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {pending ? "Enviando..." : "Confirmar pedido"}
          </button>
        </section>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={3}
          className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      )}
    </label>
  );
}
