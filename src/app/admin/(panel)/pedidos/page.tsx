import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-50 text-yellow-700" },
  paid: { label: "Pago", className: "bg-blue-50 text-blue-700" },
  shipped: { label: "Enviado", className: "bg-purple-50 text-purple-700" },
  delivered: { label: "Entregue", className: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelado", className: "bg-red-50 text-red-700" },
};

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, total, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide">Pedidos</h1>
      <p className="mt-1 text-sm text-ink/60">
        {orders?.length ?? 0} {orders?.length === 1 ? "pedido" : "pedidos"} registrados.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {(!orders || orders.length === 0) ? (
          <p className="p-12 text-center text-sm text-ink/50">
            Nenhum pedido ainda. Os pedidos finalizados pelos clientes aparecerão aqui.
          </p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {orders.map((o) => {
              const s = statusLabels[o.status] ?? statusLabels.pending;
              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-blush sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {o.customer_name || "Cliente sem nome"}
                      </p>
                      <p className="truncate text-xs text-ink/50">
                        {o.customer_email || "—"}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-ink/40">
                        {new Date(o.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(o.total)}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[10px] uppercase tracking-widest ${s.className}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
