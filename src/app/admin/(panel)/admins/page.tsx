import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminsManager } from "@/components/admin/AdminsManager";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: admins } = await supabase
    .from("admins")
    .select("user_id, email, created_at")
    .order("created_at");

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide">Administradores</h1>
      <p className="mt-1 text-sm text-ink/60">
        Pessoas com acesso ao painel.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {(!admins || admins.length === 0) ? (
          <p className="p-6 text-sm text-ink/50">Nenhum admin cadastrado ainda.</p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {admins.map((a) => (
              <li key={a.user_id} className="px-5 py-4">
                <p className="text-sm font-medium">{a.email}</p>
                <p className="text-xs text-ink/40">
                  Desde {new Date(a.created_at).toLocaleDateString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <AdminsManager />
      </div>
    </div>
  );
}
