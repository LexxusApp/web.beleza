import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order")
    .order("name");

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide">Categorias</h1>
      <p className="mt-1 text-sm text-ink/60">
        Organize seus produtos por categoria.
      </p>

      <div className="mt-8">
        <CategoriesManager categories={categories ?? []} />
      </div>
    </div>
  );
}
