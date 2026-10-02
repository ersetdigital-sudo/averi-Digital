'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, getAdminUser } from '@/lib/supabase/server';
import { slugify } from '@/lib/slug';

/**
 * Server action CRUD katalog (kategori, provider, produk).
 *
 * Semua aksi WAJIB melewati `getAdminUser()` — tabel katalog ditulis memakai
 * service role, jadi keanggotaan admin tidak boleh diasumsikan dari sesi saja.
 */

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

const DENIED = 'Akses ditolak. Silakan masuk sebagai admin.';

/* ------------------------------------------------------------------ *
 * Util
 * ------------------------------------------------------------------ */

/** Pastikan slug unik di tabel; tambah sufiks angka bila sudah dipakai. */
async function uniqueSlug(
  table: 'products' | 'categories' | 'providers',
  base: string,
  ignoreId?: string
): Promise<string> {
  const supabase = createAdminClient();
  const seed = base || `item-${Date.now()}`;

  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? seed : `${seed}-${i + 1}`;
    let query = supabase.from(table).select('id').eq('slug', candidate).limit(1);
    if (ignoreId) query = query.neq('id', ignoreId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
  }
  return `${seed}-${Date.now()}`;
}

function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/katalog');
  revalidatePath('/admin');
  revalidatePath('/admin/produk');
  revalidatePath('/admin/kategori');
}

function fail(error: unknown): ActionResult {
  return { ok: false, error: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
}

/* ------------------------------------------------------------------ *
 * KATEGORI
 * ------------------------------------------------------------------ */

export interface CategoryInput {
  id?: string;
  name: string;
  slug?: string;
  short?: string;
  blurb?: string;
  icon?: string;
  productPrefix?: string;
  isBill?: boolean;
  destLabel?: string;
  destPlaceholder?: string;
  destHint?: string;
  phoneInput?: boolean;
  minDigits?: number;
  maxDigits?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export async function saveCategory(input: CategoryInput): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const name = (input.name ?? '').trim();
  if (!name) return { ok: false, error: 'Nama kategori wajib diisi.' };

  const minDigits = Number(input.minDigits ?? 6);
  const maxDigits = Number(input.maxDigits ?? 16);
  if (minDigits < 1 || maxDigits < minDigits) {
    return { ok: false, error: 'Rentang digit tidak valid.' };
  }

  try {
    const supabase = createAdminClient();
    const slug = await uniqueSlug('categories', input.slug?.trim() || slugify(name), input.id);

    const payload = {
      slug,
      name,
      short: (input.short ?? name).trim(),
      blurb: (input.blurb ?? '').trim(),
      icon: (input.icon ?? 'grid').trim() || 'grid',
      product_prefix: (input.productPrefix ?? name).trim(),
      is_bill: Boolean(input.isBill),
      dest_label: (input.destLabel ?? 'Nomor tujuan').trim(),
      dest_placeholder: (input.destPlaceholder ?? '').trim(),
      dest_hint: (input.destHint ?? '').trim(),
      phone_input: Boolean(input.phoneInput),
      min_digits: minDigits,
      max_digits: maxDigits,
      sort_order: Number(input.sortOrder ?? 0),
      is_active: input.isActive ?? true,
    };

    const { error } = input.id
      ? await supabase.from('categories').update(payload).eq('id', input.id)
      : await supabase.from('categories').insert(payload);

    if (error) return { ok: false, error: error.message };

    revalidateCatalog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setCategoryActive(id: string, active: boolean): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const { error } = await createAdminClient()
      .from('categories')
      .update({ is_active: active })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateCatalog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if ((count ?? 0) > 0) {
      return {
        ok: false,
        error: `Kategori masih punya ${count} produk. Pindahkan atau hapus produknya dulu.`,
      };
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateCatalog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ------------------------------------------------------------------ *
 * PROVIDER / OPERATOR
 * ------------------------------------------------------------------ */

export interface ProviderInput {
  id?: string;
  categoryId: string;
  name: string;
  slug?: string;
  code?: string;
  swatch?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function saveProvider(input: ProviderInput): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const name = (input.name ?? '').trim();
  if (!name) return { ok: false, error: 'Nama provider wajib diisi.' };
  if (!input.categoryId) return { ok: false, error: 'Kategori provider wajib dipilih.' };

  try {
    const supabase = createAdminClient();
    const slug = await uniqueSlug('providers', input.slug?.trim() || slugify(name), input.id);

    const payload = {
      category_id: input.categoryId,
      slug,
      name,
      code: (input.code ?? '').trim().toUpperCase(),
      swatch: (input.swatch ?? '#006491').trim() || '#006491',
      sort_order: Number(input.sortOrder ?? 0),
      is_active: input.isActive ?? true,
    };

    const { error } = input.id
      ? await supabase.from('providers').update(payload).eq('id', input.id)
      : await supabase.from('providers').insert(payload);

    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setProviderActive(id: string, active: boolean): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const { error } = await createAdminClient()
      .from('providers')
      .update({ is_active: active })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteProvider(id: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const { error } = await createAdminClient().from('providers').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/produk');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ------------------------------------------------------------------ *
 * PRODUK
 * ------------------------------------------------------------------ */

export interface ProductInput {
  id?: string;
  categoryId: string;
  providerId?: string | null;
  name: string;
  slug?: string;
  sku?: string;
  nominalLabel?: string;
  nominalNote?: string;
  description?: string;
  costPrice: number;
  price: number;
  badge?: string;
  popularity?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const name = (input.name ?? '').trim();
  if (!name) return { ok: false, error: 'Nama produk wajib diisi.' };
  if (!input.categoryId) return { ok: false, error: 'Kategori wajib dipilih.' };

  const price = Number(input.price);
  const costPrice = Number(input.costPrice ?? 0);
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Harga jual tidak valid.' };
  if (!Number.isFinite(costPrice) || costPrice < 0) {
    return { ok: false, error: 'Harga modal tidak valid.' };
  }

  const badge = ['POPULER', 'HEMAT', 'PROMO'].includes(String(input.badge))
    ? String(input.badge)
    : null;

  try {
    const supabase = createAdminClient();
    const slug = await uniqueSlug('products', input.slug?.trim() || slugify(name), input.id);

    const payload = {
      category_id: input.categoryId,
      provider_id: input.providerId || null,
      slug,
      name,
      sku: (input.sku ?? '').trim() || null,
      nominal_label: (input.nominalLabel ?? '').trim(),
      nominal_note: (input.nominalNote ?? '').trim(),
      description: (input.description ?? '').trim(),
      cost_price: costPrice,
      price,
      badge,
      popularity: Number(input.popularity ?? 0),
      sort_order: Number(input.sortOrder ?? 0),
      is_active: input.isActive ?? true,
    };

    const { error } = input.id
      ? await supabase.from('products').update(payload).eq('id', input.id)
      : await supabase.from('products').insert(payload);

    if (error) return { ok: false, error: error.message };

    revalidateCatalog();
    revalidatePath(`/produk/${slug}`);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setProductActive(id: string, active: boolean): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const { error } = await createAdminClient()
      .from('products')
      .update({ is_active: active })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateCatalog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };
  try {
    const { error } = await createAdminClient().from('products').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateCatalog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
