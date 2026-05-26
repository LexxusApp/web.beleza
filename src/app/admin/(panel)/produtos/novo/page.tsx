import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return <ProductForm categories={categories ?? []} action={createProduct} />;
}
