import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/supabase/types";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
      >
        ← Voltar
      </Link>
      <h1 className="font-display mt-2 text-3xl tracking-wide">Pedido</h1>
      <p className="mt-1 text-xs uppercase tracking-widest text-ink/40">
        #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString("pt-BR")}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-ink/10 bg-white p-5 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
            Itens
          </h2>
          <ul className="mt-4 divide-y divide-ink/5">
            {(items ?? []).map((it) => (
              <li key={it.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-xs font-bold tracking-wide">{it.brand}</p>
                  <p className="text-sm text-ink/70">{it.name}</p>
                  <p className="text-xs text-ink/40">
                    {it.quantity} × {formatPrice(it.unit_price)}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(it.unit_price * it.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
            <span className="text-sm uppercase tracking-widest text-ink/60">Total</span>
            <span className="text-lg font-medium">{formatPrice(order.total)}</span>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Cliente
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-ink/40">Nome</dt>
                <dd>{order.customer_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/40">E-mail</dt>
                <dd>{order.customer_email || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/40">Telefone</dt>
                <dd>{order.customer_phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/40">Endereço</dt>
                <dd className="whitespace-pre-wrap">{order.shipping_address || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Status
            </h2>
            <OrderStatusForm id={order.id} currentStatus={order.status} />
          </section>
        </aside>
      </div>
    </div>
  );
}
