-- ============================================================
-- Lumière — Schema inicial do e-commerce
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- TABELAS
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand text not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  how_to_use text,
  ingredients text,
  stock int not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);
create index if not exists products_featured_idx on public.products (featured);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_id);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  total numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','paid','shipped','delivered','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  brand text,
  name text,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ============================================================
-- HELPER: is_admin()
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.reviews        enable row level security;
alter table public.admins         enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- CATEGORIES: leitura pública, escrita admin
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- PRODUCTS: leitura pública apenas dos ativos, escrita admin
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- REVIEWS: leitura pública, escrita admin
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ADMINS: só admin lê/escreve
drop policy if exists "admins_admin_only" on public.admins;
create policy "admins_admin_only" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS: clientes podem criar; só admin lista
drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read" on public.orders
  for select using (public.is_admin());

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert with check (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ORDER_ITEMS: idem
drop policy if exists "order_items_admin_read" on public.order_items;
create policy "order_items_admin_read" on public.order_items
  for select using (public.is_admin());

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert with check (true);

-- ============================================================
-- STORAGE BUCKET: products
-- ============================================================

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "products_public_read_storage" on storage.objects;
create policy "products_public_read_storage" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "products_admin_write_storage" on storage.objects;
create policy "products_admin_write_storage" on storage.objects
  for all using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());
