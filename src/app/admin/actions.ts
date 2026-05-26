"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isAdmin } from "@/lib/supabase/server";

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) throw new Error("Acesso negado.");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseFormPrice(value: FormDataEntryValue | null): number {
  const raw = String(value ?? "0").replace(/\./g, "").replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = await createSupabaseServerClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("products")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Falha no upload: ${error.message}`);

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}

// ============================================================
// PRODUCTS
// ============================================================

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const brand = String(formData.get("brand") || "").trim();
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(`${brand}-${name}`);
  else slug = slugify(slug);

  const file = formData.get("image") as File | null;
  const imageUrl = file && file.size > 0 ? await uploadImage(file) : null;

  const payload = {
    slug,
    brand,
    name,
    description: String(formData.get("description") || "").trim() || null,
    price: parseFormPrice(formData.get("price")),
    compare_at_price: formData.get("compare_at_price")
      ? parseFormPrice(formData.get("compare_at_price"))
      : null,
    image_url: imageUrl,
    category_id: (formData.get("category_id") || null) as string | null,
    how_to_use: String(formData.get("how_to_use") || "").trim() || null,
    ingredients: String(formData.get("ingredients") || "").trim() || null,
    stock: Number(formData.get("stock") || 0),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${data.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const brand = String(formData.get("brand") || "").trim();
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(`${brand}-${name}`);
  else slug = slugify(slug);

  const file = formData.get("image") as File | null;
  const newImageUrl = file && file.size > 0 ? await uploadImage(file) : null;

  const payload: Record<string, unknown> = {
    slug,
    brand,
    name,
    description: String(formData.get("description") || "").trim() || null,
    price: parseFormPrice(formData.get("price")),
    compare_at_price: formData.get("compare_at_price")
      ? parseFormPrice(formData.get("compare_at_price"))
      : null,
    category_id: (formData.get("category_id") || null) as string | null,
    how_to_use: String(formData.get("how_to_use") || "").trim() || null,
    ingredients: String(formData.get("ingredients") || "").trim() || null,
    stock: Number(formData.get("stock") || 0),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  if (newImageUrl) payload.image_url = newImageUrl;

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/produto/${slug}`);
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

// ============================================================
// CATEGORIES
// ============================================================

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name);
  else slug = slugify(slug);

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: String(formData.get("description") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/categorias");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(name);
  else slug = slugify(slug);

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      description: String(formData.get("description") || "").trim() || null,
      sort_order: Number(formData.get("sort_order") || 0),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/categorias");
}

// ============================================================
// ORDERS
// ============================================================

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Status inválido.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}
