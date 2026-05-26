"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ProductImage } from "@/components/ProductImage";
import { productImageUrl } from "@/lib/supabase/types";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    slug: string;
    brand: string;
    name: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    image_url: string | null;
    category_id: string | null;
    how_to_use: string | null;
    ingredients: string | null;
    stock: number;
    featured: boolean;
    active: boolean;
  };
  action: (formData: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function ProductForm({ categories, product, action, onDelete }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(formData);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado");
      }
    });
  }

  function handleDelete() {
    if (!onDelete) return;
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    startTransition(async () => {
      try {
        await onDelete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao excluir");
      }
    });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/produtos"
            className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
          >
            ← Voltar
          </Link>
          <h1 className="font-display mt-2 text-3xl tracking-wide">
            {product ? "Editar produto" : "Novo produto"}
          </h1>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="flex min-h-[48px] items-center rounded-full border border-red-200 px-5 text-xs font-semibold uppercase tracking-widest text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Excluir
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex min-h-[48px] items-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-widest text-white hover:bg-ink/90 disabled:opacity-50"
          >
            {pending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
            Informações principais
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marca" required>
              <input
                name="brand"
                required
                defaultValue={product?.brand}
                className="input"
              />
            </Field>
            <Field label="Nome">
              <input
                name="name"
                required
                defaultValue={product?.name}
                className="input"
              />
            </Field>
          </div>

          <Field label="Slug (URL)" hint="Deixe em branco para gerar automaticamente.">
            <input
              name="slug"
              defaultValue={product?.slug}
              className="input"
              placeholder="ex: rouge-velours-chanel"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description ?? ""}
              className="input min-h-[88px]"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Preço (R$)" required>
              <input
                name="price"
                required
                defaultValue={product?.price ?? ""}
                inputMode="decimal"
                placeholder="0,00"
                className="input"
              />
            </Field>
            <Field label="Preço de" hint="Para mostrar desconto.">
              <input
                name="compare_at_price"
                defaultValue={product?.compare_at_price ?? ""}
                inputMode="decimal"
                placeholder="0,00"
                className="input"
              />
            </Field>
            <Field label="Estoque" required>
              <input
                name="stock"
                type="number"
                min={0}
                required
                defaultValue={product?.stock ?? 0}
                className="input"
              />
            </Field>
          </div>

          <Field label="Categoria">
            <select
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className="input"
            >
              <option value="">— sem categoria —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Como usar">
            <textarea
              name="how_to_use"
              rows={3}
              defaultValue={product?.how_to_use ?? ""}
              className="input min-h-[88px]"
            />
          </Field>

          <Field label="Ingredientes">
            <textarea
              name="ingredients"
              rows={3}
              defaultValue={product?.ingredients ?? ""}
              className="input min-h-[88px]"
            />
          </Field>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Imagem
            </h2>
            <div className="relative mt-3 aspect-square overflow-hidden rounded-xl bg-blush">
              {preview ? (
                <ProductImage
                  src={preview.startsWith("blob:") ? preview : productImageUrl({ image_url: preview })}
                  alt="Pré-visualização"
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-ink/40">
                  Sem imagem
                </div>
              )}
            </div>
            <label className="mt-3 flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border border-ink/15 text-xs font-semibold uppercase tracking-widest hover:bg-blush">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
              Escolher imagem
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Visibilidade
            </h2>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                defaultChecked={product?.active ?? true}
                className="h-5 w-5"
              />
              <span className="text-sm">Ativo (aparece no site)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="h-5 w-5"
              />
              <span className="text-sm">Destaque (Novidades)</span>
            </label>
          </section>
        </aside>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(26, 26, 26, 0.12);
          background: #faf8f5;
          padding: 12px 14px;
          font-size: 14px;
          color: #1a1a1a;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #c9a962;
          box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.2);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-ink/40">{hint}</span>}
    </label>
  );
}
