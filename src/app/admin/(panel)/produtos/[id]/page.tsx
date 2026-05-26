import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { deleteProduct, updateProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={categories ?? []}
      product={product}
      action={async (formData: FormData) => {
        "use server";
        await updateProduct(id, formData);
      }}
      onDelete={async () => {
        "use server";
        await deleteProduct(id);
      }}
    />
  );
}
