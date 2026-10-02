-- ============================================================================
-- Averi Digital — Katalog (Kategori, Provider, Produk)
-- Project: wucrpywhqkfmeimlqwvv
--
-- Idempotent: aman dijalankan berulang.
-- Relasi: categories 1—N providers 1—N products.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- KATEGORI
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  short            text not null default '',
  blurb            text not null default '',
  icon             text not null default 'grid',
  product_prefix   text not null default '',
  is_bill          boolean not null default false,
  dest_label       text not null default 'Nomor tujuan',
  dest_placeholder text not null default '',
  dest_hint        text not null default '',
  phone_input      boolean not null default false,
  min_digits       int  not null default 6,
  max_digits       int  not null default 16,
  sort_order       int  not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_categories_order on public.categories (sort_order);

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- PROVIDER / OPERATOR (per kategori)
-- ---------------------------------------------------------------------------
create table if not exists public.providers (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  slug        text not null,
  name        text not null,
  code        text not null default '',
  swatch      text not null default '#006491',
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists idx_providers_category on public.providers (category_id, sort_order);

drop trigger if exists trg_providers_updated on public.providers;
create trigger trg_providers_updated
  before update on public.providers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- PRODUK
-- slug tetap dipakai storefront (/produk/[slug]) dan harus unik.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on delete restrict,
  provider_id   uuid references public.providers (id) on delete set null,
  slug          text not null unique,
  name          text not null,
  sku           text,
  nominal_label text not null default '',
  nominal_note  text not null default '',
  description   text not null default '',
  cost_price    numeric(14, 2) not null default 0,
  price         numeric(14, 2) not null default 0,
  badge         text check (badge in ('POPULER', 'HEMAT', 'PROMO') or badge is null),
  popularity    int not null default 0,
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category_id, sort_order);
create index if not exists idx_products_provider on public.products (provider_id);
create index if not exists idx_products_active   on public.products (is_active);

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Publik  : hanya boleh BACA baris aktif.
-- Admin   : full akses (termasuk baris nonaktif).
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.providers  enable row level security;
alter table public.products   enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "providers_public_read" on public.providers;
create policy "providers_public_read" on public.providers
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "providers_admin_write" on public.providers;
create policy "providers_admin_write" on public.providers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- STATISTIK DASHBOARD (termasuk katalog)
-- ---------------------------------------------------------------------------
create or replace function public.admin_dashboard_stats()
returns json
language sql
stable
security definer
set search_path to 'public'
as $function$
  select json_build_object(
    'orders_total',  (select count(*) from public.orders),
    'orders_today',  (select count(*) from public.orders where created_at >= date_trunc('day', now())),
    'orders_pending', (select count(*) from public.orders where status in ('PENDING_PAYMENT', 'WAITING_VERIFICATION')),
    'orders_waiting_verification', (select count(*) from public.orders where status = 'WAITING_VERIFICATION'),
    'orders_verified', (select count(*) from public.orders where status = 'VERIFIED'),
    'orders_processing', (select count(*) from public.orders where status = 'PROCESSING'),
    'orders_failed', (select count(*) from public.orders where status in ('FAILED', 'EXPIRED')),
    'orders_success', (select count(*) from public.orders where status = 'SUCCESS'),
    'revenue_total', (select coalesce(sum(total), 0) from public.orders where status = 'SUCCESS'),
    'revenue_today', (select coalesce(sum(total), 0) from public.orders where status = 'SUCCESS' and created_at >= date_trunc('day', now())),
    'products_total', (select count(*) from public.products),
    'products_active', (select count(*) from public.products where is_active),
    'categories_total', (select count(*) from public.categories),
    'categories_active', (select count(*) from public.categories where is_active)
  );
$function$;

revoke execute on function public.admin_dashboard_stats() from anon, authenticated;
