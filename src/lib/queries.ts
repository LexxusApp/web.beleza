import "server-only";
import { createSupabaseServerClient } from "./supabase/server";
import type {
  Category,
  Product,
  ProductWithCategory,
  Review,
} from "./supabase/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ProductWithCategory[] | null) ?? [];
}

export async function getProductsByCategory(
  categorySlug: string,
  limit = 8
): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories!inner(id,name,slug)")
    .eq("active", true)
    .eq("categories.slug", categorySlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ProductWithCategory[] | null) ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<(ProductWithCategory & { reviews: Review[] }) | null> {
  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!product) return null;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  return { ...(product as ProductWithCategory), reviews: reviews ?? [] };
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const supabase = await createSupabaseServerClient();
  const pattern = `%${q}%`;
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .or(`brand.ilike.${pattern},name.ilike.${pattern}`)
    .limit(8);

  return data ?? [];
}
