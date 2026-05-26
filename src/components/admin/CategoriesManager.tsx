"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/admin/actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await createCategory(formData);
        form.reset();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      }
    });
  }

  function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateCategory(id, formData);
        setEditingId(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria? Produtos vinculados ficarão sem categoria.")) return;
    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      }
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
          Nova categoria
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Nome (ex: Skincare)"
            required
            className="input"
          />
          <input
            name="slug"
            placeholder="Slug (opcional)"
            className="input"
          />
        </div>
        <input
          name="description"
          placeholder="Descrição (opcional)"
          className="input"
        />
        <div className="flex gap-3">
          <input
            type="number"
            name="sort_order"
            placeholder="Ordem"
            defaultValue={0}
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={pending}
            className="min-h-[48px] rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink/50">
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {categories.map((c) => (
              <li key={c.id} className="p-4 sm:p-5">
                {editingId === c.id ? (
                  <form onSubmit={(e) => handleUpdate(c.id, e)} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input name="name" defaultValue={c.name} required className="input" />
                      <input name="slug" defaultValue={c.slug} className="input" />
                    </div>
                    <input
                      name="description"
                      defaultValue={c.description ?? ""}
                      placeholder="Descrição"
                      className="input"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="sort_order"
                        defaultValue={c.sort_order}
                        className="input flex-1"
                      />
                      <button
                        type="submit"
                        disabled={pending}
                        className="min-h-[44px] rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-widest text-white"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="min-h-[44px] rounded-full border border-ink/15 px-5 text-xs font-semibold uppercase tracking-widest"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-ink/50">
                        /{c.slug} · ordem {c.sort_order}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(c.id)}
                        className="min-h-[40px] rounded-full border border-ink/15 px-4 text-xs uppercase tracking-widest hover:bg-blush"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="min-h-[40px] rounded-full border border-red-200 px-4 text-xs uppercase tracking-widest text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(26, 26, 26, 0.12);
          background: #faf8f5;
          padding: 12px 14px;
          font-size: 14px;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #c9a962;
          box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.2);
        }
      `}</style>
    </div>
  );
}
