import { createAdminClient } from './supabase/server';
import type { CategoryMeta, NominalTag, Product, ProductView, Provider } from '../types';
import { DEFAULT_ICON } from './icons';

/**
 * Lapisan data katalog (kategori, provider, produk) — SATU-SATUNYA sumber data
 * untuk storefront maupun panel admin.
 *
 * Semua fungsi di sini hanya untuk server: tabel katalog dibaca memakai service
 * role supaya admin tetap melihat baris nonaktif, sementara storefront memakai
 * filter `isActive`. Jangan impor modul ini dari komponen client.
 */

const CATEGORY_COLUMNS =
  'id, slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active';
const PROVIDER_COLUMNS = 'id, category_id, slug, name, code, swatch, sort_order, is_active';
const PRODUCT_COLUMNS =
  'id, category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active';

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  product_prefix: string;
  is_bill: boolean;
  dest_label: string;
  dest_placeholder: string;
  dest_hint: string;
  phone_input: boolean;
  min_digits: number;
  max_digits: number;
  sort_order: number;
  is_active: boolean;
}

export interface ProviderRow {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  code: string;
  swatch: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductRow {
  id: string;
  category_id: string;
  provider_id: string | null;
  slug: string;
  name: string;
  sku: string | null;
  nominal_label: string;
  nominal_note: string;
  description: string;
  cost_price: number | string;
  price: number | string;
  badge: string | null;
  popularity: number;
  sort_order: number;
  is_active: boolean;
}

export type ProviderWithCategory = Provider & { categoryId: string };

/* ------------------------------------------------------------------ *
 * Mappers
 * ------------------------------------------------------------------ */

export function mapCategory(row: CategoryRow): CategoryMeta {
  return {
    id: String(row.slug),
    name: String(row.name ?? ''),
    short: String(row.short ?? row.name ?? ''),
    blurb: String(row.blurb ?? ''),
    icon: (String(row.icon ?? '') || DEFAULT_ICON) as CategoryMeta['icon'],
    productPrefix: String(row.product_prefix ?? ''),
    isBill: Boolean(row.is_bill),
    destLabel: String(row.dest_label ?? 'Nomor tujuan'),
    destPlaceholder: String(row.dest_placeholder ?? ''),
    destHint: String(row.dest_hint ?? ''),
    phoneInput: Boolean(row.phone_input),
    minDigits: Number(row.min_digits ?? 6),
    maxDigits: Number(row.max_digits ?? 16),
    sortOrder: Number(row.sort_order ?? 0),
    isActive: Boolean(row.is_active),
  };
}

function mapProvider(row: ProviderRow): ProviderWithCategory {
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    slug: String(row.slug),
    name: String(row.name ?? ''),
    code: String(row.code ?? ''),
    swatch: String(row.swatch ?? '#006491'),
  };
}

function badgeOf(value: string | null): NominalTag | undefined {
  return value === 'POPULER' || value === 'HEMAT' || value === 'PROMO' ? value : undefined;
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

export async function getCategories(activeOnly = true): Promise<CategoryMeta[]> {
  let query = createAdminClient()
    .from('categories')
    .select(CATEGORY_COLUMNS)
    .order('sort_order', { ascending: true });
  if (activeOnly) query = query.eq('is_active', true);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategory);
}

export async function getProviders(): Promise<ProviderWithCategory[]> {
  const { data, error } = await createAdminClient()
    .from('providers')
    .select(PROVIDER_COLUMNS)
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return (data as ProviderRow[]).map(mapProvider);
}

/** Kategori + UUID asli (dibutuhkan form admin untuk relasi foreign key). */
export interface AdminCategory extends CategoryMeta {
  uuid: string;
}

export async function getCategoriesAdmin(): Promise<AdminCategory[]> {
  const { data, error } = await createAdminClient()
    .from('categories')
    .select(`${CATEGORY_COLUMNS}`)
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return (data as CategoryRow[]).map((row) => ({ ...mapCategory(row), uuid: String(row.id) }));
}

/** Provider + slug kategori + status (untuk halaman admin). */
export interface AdminProvider extends ProviderWithCategory {
  categorySlug: string;
  isActive: boolean;
}

export async function getProvidersAdmin(): Promise<AdminProvider[]> {
  const { data, error } = await createAdminClient()
    .from('providers')
    .select(`${PROVIDER_COLUMNS}, categories ( slug, name )`)
    .order('sort_order', { ascending: true });
  if (error || !data) return [];

  type Joined = ProviderRow & { categories: { slug?: string } | { slug?: string }[] | null };
  return (data as unknown as Joined[]).map((row) => {
    const joined = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    return {
      ...mapProvider(row),
      categorySlug: String(joined?.slug ?? ''),
      isActive: Boolean(row.is_active),
    };
  });
}

export interface ProductQuery {
  activeOnly?: boolean;
  categorySlug?: string;
  categoryId?: string;
}

/** Semua produk (default: hanya yang aktif) — sudah memetakan kategori & provider. */
export async function getProducts(opts: ProductQuery = {}): Promise<Product[]> {
  const { activeOnly = true, categorySlug, categoryId } = opts;

  const [categoryRows, providers] = await Promise.all([
    createAdminClient().from('categories').select('id, slug'),
    getProviders(),
  ]);
  // Peta UUID kategori -> slug (kunci relasi di tabel products adalah UUID).
  const categorySlugById = new Map(
    ((categoryRows.data ?? []) as { id: string; slug: string }[]).map((row) => [
      String(row.id),
      String(row.slug),
    ])
  );
  const providerSlugById = new Map(providers.map((p) => [p.id, p.slug]));

  let query = createAdminClient()
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('sort_order', { ascending: true });
  if (activeOnly) query = query.eq('is_active', true);
  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query;
  if (error || !data) return [];

  const products = (data as ProductRow[]).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    category: categorySlugById.get(String(row.category_id)) ?? '',
    providerId: row.provider_id ? providerSlugById.get(String(row.provider_id)) ?? '' : '',
    name: String(row.name ?? ''),
    sku: row.sku ? String(row.sku) : undefined,
    desc: String(row.description ?? ''),
    nominalLabel: String(row.nominal_label ?? ''),
    nominalNote: String(row.nominal_note ?? ''),
    price: Number(row.price ?? 0),
    costPrice: Number(row.cost_price ?? 0),
    badge: badgeOf(row.badge),
    popularity: Number(row.popularity ?? 0),
    sortOrder: Number(row.sort_order ?? 0),
    isActive: Boolean(row.is_active),
  }));

  return categorySlug ? products.filter((p) => p.category === categorySlug) : products;
}

/** Susun ProductView (kategori + provider sudah di-resolve). */
export function resolveViews(
  products: Product[],
  categories: CategoryMeta[],
  providers: ProviderWithCategory[]
): ProductView[] {
  const catBySlug = new Map(categories.map((c) => [c.id, c]));
  const provBySlug = new Map(providers.map((p) => [p.slug, p]));

  return products.map((p) => {
    const cat = catBySlug.get(p.category);
    const prov = provBySlug.get(p.providerId);
    return {
      ...p,
      categoryName: cat?.name ?? p.category,
      categoryIcon: cat?.icon ?? DEFAULT_ICON,
      isBill: cat?.isBill ?? false,
      providerName: prov?.name ?? p.providerId,
      providerSwatch: prov?.swatch ?? '#006491',
      destLabel: cat?.destLabel ?? 'Nomor tujuan',
      destPlaceholder: cat?.destPlaceholder ?? '',
      phoneInput: cat?.phoneInput ?? false,
      minDigits: cat?.minDigits ?? 6,
      maxDigits: cat?.maxDigits ?? 16,
    };
  });
}

/** Katalog lengkap untuk storefront: hanya kategori & produk aktif. */
export async function getStorefrontCatalog(): Promise<{
  categories: CategoryMeta[];
  products: ProductView[];
}> {
  const [categories, providers, products] = await Promise.all([
    getCategories(true),
    getProviders(),
    getProducts({ activeOnly: true }),
  ]);

  // Produk dari kategori nonaktif tidak boleh muncul di storefront.
  const activeCategories = new Set(categories.map((c) => c.id));
  const visible = products.filter((p) => activeCategories.has(p.category));

  return { categories, products: resolveViews(visible, categories, providers) };
}

/** Satu produk (view lengkap) berdasarkan slug — untuk halaman detail & checkout. */
export async function getProductViewBySlug(slug: string): Promise<ProductView | null> {
  if (!slug) return null;

  const [categories, providers, products] = await Promise.all([
    getCategories(false),
    getProviders(),
    getProducts({ activeOnly: true }),
  ]);
  const found = products.find((p) => p.slug === slug);
  // Produk dari kategori nonaktif juga tidak bisa diakses langsung.
  if (!found || !categories.find((c) => c.id === found.category)?.isActive) return null;
  return resolveViews([found], categories, providers)[0] ?? null;
}

/** Resolve produk lama (?service=&prov=&nom=) ke produk aktif pertama di kategori itu. */
export async function getProductViewByLegacy(
  categorySlug: string | null,
  providerSlug: string | null,
  nominal: string | null
): Promise<ProductView | null> {
  if (!categorySlug || !providerSlug) return null;

  const { products } = await getStorefrontCatalog();
  const inCategory = products.filter(
    (p) => p.category === categorySlug && p.providerId === providerSlug
  );
  if (inCategory.length === 0) return null;

  if (nominal) {
    const exact = inCategory.find((p) => p.slug === `${providerSlug}-${nominal}`);
    if (exact) return exact;
  }
  return inCategory[0];
}

/** Jumlah produk per kategori (untuk halaman Kategori admin). */
export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  const [rawCategories, rawProducts] = await Promise.all([
    supabase.from('categories').select('id, slug'),
    supabase.from('products').select('category_id'),
  ]);

  const countById = new Map<string, number>();
  for (const row of (rawProducts.data ?? []) as { category_id: string }[]) {
    const key = String(row.category_id);
    countById.set(key, (countById.get(key) ?? 0) + 1);
  }

  const result: Record<string, number> = {};
  for (const row of (rawCategories.data ?? []) as { id: string; slug: string }[]) {
    result[String(row.slug)] = countById.get(String(row.id)) ?? 0;
  }
  return result;
}
