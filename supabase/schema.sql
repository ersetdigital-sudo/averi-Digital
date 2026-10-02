-- ============================================================================
-- Averi Digital — Skema Database (Supabase / PostgreSQL)
-- Project: wucrpywhqkfmeimlqwvv  (region ap-southeast-2)
-- Jalankan sekali; skrip ini idempotent (aman dijalankan berulang).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: trigger updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- ADMIN ALLOWLIST
-- Hanya user yang terdaftar di sini yang dianggap admin.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- PENGATURAN SITUS (key-value)
-- Dipakai untuk: nama brand, nomor WhatsApp CS, gambar QRIS, instruksi bayar.
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      text not null default '',
  label      text not null default '',
  group_name text not null default 'umum',
  sort_order int  not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- PESANAN
--
-- Alur status (PENTING):
--   PENDING_PAYMENT      -> pelanggan belum melaporkan pembayaran
--   WAITING_VERIFICATION -> pelanggan menekan "Saya Sudah Bayar" (bukan bukti!)
--   VERIFIED             -> admin memastikan dana masuk
--   PROCESSING           -> produk dikirim ke biller (serial/token terbit di sini)
--   SUCCESS              -> produk terkirim ke pelanggan
--   FAILED               -> pembayaran tidak ditemukan / ditolak
--   EXPIRED              -> QRIS kedaluwarsa sebelum dibayar
--
-- serial & token SENGAJA nullable dan baru diisi setelah VERIFIED.
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  invoice             text not null unique,
  product_slug        text,
  service_name        text not null default '',
  provider_name       text not null default '',
  nominal_label       text not null default '',
  destination         text not null,
  total               numeric(14, 2) not null default 0,
  status              text not null default 'PENDING_PAYMENT'
                      check (status in (
                        'PENDING_PAYMENT', 'WAITING_VERIFICATION', 'VERIFIED',
                        'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED'
                      )),
  serial              text,
  token               text,
  admin_note          text,
  payment_method      text not null default 'QRIS Standar Nasional',
  payment_reported_at timestamptz,
  verified_at         timestamptz,
  processed_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_orders_created on public.orders (created_at desc);
create index if not exists idx_orders_status  on public.orders (status);
create index if not exists idx_orders_invoice on public.orders (invoice);

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Publik  : hanya boleh BACA pengaturan.
-- Admin   : full akses.
-- orders  : TIDAK bisa dibaca publik (berisi nomor tujuan & serial).
-- ---------------------------------------------------------------------------
alter table public.settings    enable row level security;
alter table public.orders      enable row level security;
alter table public.admin_users enable row level security;

-- ---- settings ----
drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read" on public.settings
  for select to anon, authenticated using (true);

drop policy if exists "settings_admin_write" on public.settings;
create policy "settings_admin_write" on public.settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---- orders: hanya admin ----
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---- admin_users ----
drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users
  for select to authenticated
  using (public.is_admin() or user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- STATISTIK DASHBOARD ADMIN
-- Dipanggil dari server memakai service role; execute dicabut dari publik.
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
    'revenue_today', (select coalesce(sum(total), 0) from public.orders where status = 'SUCCESS' and created_at >= date_trunc('day', now()))
  );
$function$;

revoke execute on function public.admin_dashboard_stats() from anon, authenticated;

-- ============================================================================
-- SEED PENGATURAN
-- ============================================================================
insert into public.settings (key, value, label, group_name, sort_order) values
  ('site_name',            'Averi Digital',   'Nama Situs',          'umum', 1),
  ('site_tagline',         'Isi ulang & bayar tagihan, sekali klik.', 'Tagline', 'umum', 2),
  ('qris_merchant',        'AVERI DIGITAL',   'Nama Merchant QRIS',  'pembayaran', 1),
  ('qris_image_url',       '',                'Gambar QRIS',         'pembayaran', 2),
  ('payment_method',       'QRIS Standar Nasional', 'Metode Pembayaran', 'pembayaran', 3),
  ('payment_instructions', 'Scan QRIS dengan aplikasi bank atau e-wallet apa pun. Setelah membayar, tekan tombol konfirmasi agar laporan pembayaran kamu diperiksa tim kami.', 'Instruksi Pembayaran', 'pembayaran', 4),
  ('whatsapp_cs',          '6281234567890',   'Nomor WhatsApp CS',   'kontak', 1),
  ('cs_hours',             '08.00 – 22.00 WIB', 'Jam Layanan CS',    'kontak', 2),
  ('support_email',        '',                'Email Dukungan',      'kontak', 3)
on conflict (key) do nothing;
