import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice, productImageUrl } from "@/lib/supabase/types";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, brand, name, price, image_url, stock, active, featured, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-wide">Produtos</h1>
          <p className="mt-1 text-sm text-ink/60">
            {products?.length ?? 0} {products?.length === 1 ? "item" : "itens"} cadastrados.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-widest text-white hover:bg-ink/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          Novo produto
        </Link>
      </div>

      {(!products || products.length === 0) ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <p className="text-sm text-ink/50">
            Nenhum produto cadastrado.{" "}
            <Link href="/admin/produtos/novo" className="font-medium text-ink underline">
              Adicione o primeiro
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <ul className="divide-y divide-ink/5">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/produtos/${p.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-blush sm:px-5 sm:py-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <ProductImage
                      src={productImageUrl(p)}
                      alt={p.name}
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold tracking-wide">{p.brand}</p>
                    <p className="truncate text-sm">{p.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-ink/40">
                      {p.category && Array.isArray(p.category) && p.category[0] ? (
                        <span>{p.category[0].name}</span>
                      ) : null}
                      <span>· {p.stock} un.</span>
                      {!p.active && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-600">
                          Inativo
                        </span>
                      )}
                      {p.featured && (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-gold">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="hidden shrink-0 text-sm font-medium sm:block">
                    {formatPrice(p.price)}
                  </p>
                  <svg className="h-5 w-5 shrink-0 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
