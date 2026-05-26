import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createSupabaseServerClient();
  const [products, categories, orders, lowStock] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id, brand, name, stock")
      .lte("stock", 5)
      .eq("active", true)
      .order("stock", { ascending: true })
      .limit(5),
  ]);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, customer_name, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    productCount: products.count ?? 0,
    categoryCount: categories.count ?? 0,
    orderCount: orders.count ?? 0,
    lowStock: lowStock.data ?? [],
    recentOrders: recentOrders ?? [],
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Produtos", value: stats.productCount, href: "/admin/produtos" },
    { label: "Categorias", value: stats.categoryCount, href: "/admin/categorias" },
    { label: "Pedidos", value: stats.orderCount, href: "/admin/pedidos" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-wide">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">Visão geral do seu e-commerce.</p>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-ink/10 bg-white p-6 transition-colors hover:border-ink/30"
          >
            <p className="text-xs uppercase tracking-widest text-ink/50">{c.label}</p>
            <p className="font-display mt-2 text-4xl">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink/60">
            Estoque baixo
          </h2>
          {stats.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">Todos os produtos têm estoque saudável.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {stats.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="truncate text-ink hover:underline"
                  >
                    <span className="font-bold">{p.brand}</span> — {p.name}
                  </Link>
                  <span className="ml-2 shrink-0 rounded-full bg-red-50 px-3 py-0.5 text-xs text-red-600">
                    {p.stock} un.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink/60">
            Pedidos recentes
          </h2>
          {stats.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">Nenhum pedido ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/5">
              {stats.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.customer_name || "Sem nome"}</p>
                    <p className="text-xs text-ink/40">
                      {new Date(o.created_at).toLocaleDateString("pt-BR")} · {o.status}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
