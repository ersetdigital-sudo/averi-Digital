'use client';

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AdminCategory, AdminProvider } from '@/lib/catalog';
import type { ProductView } from '@/types';
import { saveProduct, setProductActive, deleteProduct } from '@/app/actions/catalog';
import { slugify } from '@/lib/slug';
import { rupiah } from '@/lib/config';
import { Icon } from '../Icon';

interface Props {
  categories: AdminCategory[];
  providers: AdminProvider[];
  products: ProductView[];
}

interface FormState {
  id?: string;
  name: string;
  categoryUuid: string;
  providerId: string;
  sku: string;
  nominalLabel: string;
  nominalNote: string;
  description: string;
  costPrice: string;
  price: string;
  badge: string;
  sortOrder: string;
  isActive: boolean;
}

const EMPTY: FormState = {
  name: '',
  categoryUuid: '',
  providerId: '',
  sku: '',
  nominalLabel: '',
  nominalNote: '',
  description: '',
  costPrice: '0',
  price: '0',
  badge: '',
  sortOrder: '0',
  isActive: true,
};

const PAGE_SIZE = 12;

const FIELD =
  'w-full min-h-[44px] rounded-xl border-[1.5px] border-line bg-white px-3.5 text-sm text-ink outline-none transition focus:border-accent placeholder:text-muted';
const LABEL = 'mb-1.5 block text-xs font-bold text-ink';

export const ProductsManager: React.FC<Props> = ({ categories, providers, products }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('semua');
  const [status, setStatus] = useState('semua');
  const [sort, setSort] = useState('urutan');
  const [page, setPage] = useState(1);

  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Quick action "Tambah Produk" dari dashboard: /admin/produk?baru=1
  const searchParams = useSearchParams();
  const openedFromQuery = useRef(false);
  useEffect(() => {
    if (openedFromQuery.current) return;
    if (searchParams.get('baru') !== '1') return;
    openedFromQuery.current = true;
    setForm({ ...EMPTY, categoryUuid: categories[0]?.id ?? '' });
  }, [searchParams, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== 'semua' && p.category !== category) return false;
      if (status === 'aktif' && !p.isActive) return false;
      if (status === 'nonaktif' && p.isActive) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.providerName.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === 'nama') return a.name.localeCompare(b.name);
      if (sort === 'harga-asc') return a.price - b.price;
      if (sort === 'harga-desc') return b.price - a.price;
      if (sort === 'populer') return b.popularity - a.popularity;
      return a.sortOrder - b.sortOrder;
    });
    return list;
  }, [products, query, category, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const providerOptions = form
    ? providers.filter((p) => p.categorySlug === form.categoryUuid)
    : [];

  const openNew = () => {
    setError(null);
    setForm({ ...EMPTY, categoryUuid: categories[0]?.id ?? '' });
  };

  const openEdit = (p: ProductView) => {
    setError(null);
    setForm({
      id: p.id,
      name: p.name,
      categoryUuid: p.category,
      providerId: p.providerId,
      sku: p.sku ?? '',
      nominalLabel: p.nominalLabel,
      nominalNote: p.nominalNote,
      description: p.desc,
      costPrice: String(p.costPrice),
      price: String(p.price),
      badge: p.badge ?? '',
      sortOrder: String(p.sortOrder),
      isActive: p.isActive,
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const categoryRow = categories.find((c) => c.id === form.categoryUuid);
    if (!categoryRow) {
      setError('Kategori wajib dipilih.');
      return;
    }

    startTransition(async () => {
      const result = await saveProduct({
        id: form.id,
        categoryId: categoryRow.uuid,
        providerId: form.providerId || null,
        name: form.name,
        sku: form.sku,
        nominalLabel: form.nominalLabel,
        nominalNote: form.nominalNote,
        description: form.description,
        costPrice: Number(form.costPrice) || 0,
        price: Number(form.price) || 0,
        badge: form.badge,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      });

      if (!result.ok) {
        setError(result.error ?? 'Gagal menyimpan produk.');
        return;
      }
      setForm(null);
      router.refresh();
    });
  };

  const toggle = (p: ProductView) => {
    setBusyId(p.id);
    startTransition(async () => {
      await setProductActive(p.id, !p.isActive);
      router.refresh();
      setBusyId(null);
    });
  };

  const remove = (p: ProductView) => {
    if (!window.confirm(`Hapus produk "${p.name}"? Tindakan ini permanen.`)) return;
    setBusyId(p.id);
    startTransition(async () => {
      const result = await deleteProduct(p.id);
      if (!result.ok) window.alert(result.error ?? 'Gagal menghapus produk.');
      router.refresh();
      setBusyId(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="rounded-2xl border border-line bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="flex min-h-[44px] items-center gap-2 rounded-xl border-[1.5px] border-line px-3.5 focus-within:border-accent">
            <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, slug, SKU, provider..."
              aria-label="Cari produk"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter kategori"
            className={`${FIELD} lg:w-48`}
          >
            <option value="semua">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter status"
            className={`${FIELD} lg:w-40`}
          >
            <option value="semua">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Urutkan"
            className={`${FIELD} lg:w-44`}
          >
            <option value="urutan">Urutan tampil</option>
            <option value="populer">Terpopuler</option>
            <option value="nama">Nama A-Z</option>
            <option value="harga-asc">Harga terendah</option>
            <option value="harga-desc">Harga tertinggi</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted num-tabular">
            {filtered.length} produk
            {query ? ` cocok dengan “${query}”` : ''}
          </p>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:bg-accent-dark cursor-pointer"
          >
            <Icon name="spark" className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Daftar produk — tabel di desktop, kartu di mobile */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-14 text-center">
          <Icon name="search" className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-bold text-ink">Tidak ada produk</p>
          <p className="mt-1 text-xs text-muted">Ubah filter atau tambah produk baru.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-bold">Produk</th>
                  <th className="px-4 py-3 font-bold">Kategori</th>
                  <th className="px-4 py-3 font-bold">Modal</th>
                  <th className="px-4 py-3 font-bold">Jual</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <p className="font-bold text-ink">{p.name}</p>
                      <p className="text-[11px] text-muted">
                        {p.providerName} · <span className="num-tabular">{p.slug}</span>
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft">{p.categoryName}</td>
                    <td className="px-4 py-3 text-xs text-ink-soft num-tabular">
                      {rupiah(p.costPrice)}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-ink num-tabular">
                      {rupiah(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill active={p.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <RowActions
                        product={p}
                        busy={busyId === p.id || pending}
                        onEdit={() => openEdit(p)}
                        onToggle={() => toggle(p)}
                        onDelete={() => remove(p)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {visible.map((p) => (
              <div key={p.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{p.name}</p>
                    <p className="text-[11px] text-muted">{p.providerName}</p>
                  </div>
                  <StatusPill active={p.isActive} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted">
                    Modal <span className="num-tabular">{rupiah(p.costPrice)}</span>
                  </span>
                  <span className="font-bold text-ink num-tabular">{rupiah(p.price)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="min-h-[44px] flex-1 rounded-xl border-[1.5px] border-line text-xs font-bold text-ink cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(p)}
                    disabled={busyId === p.id}
                    className="min-h-[44px] flex-1 rounded-xl border-[1.5px] border-line text-xs font-bold text-ink disabled:opacity-60 cursor-pointer"
                  >
                    {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    disabled={busyId === p.id}
                    aria-label="Hapus produk"
                    className="grid min-h-[44px] w-12 place-items-center rounded-xl border-[1.5px] border-line text-gold disabled:opacity-60 cursor-pointer"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
            className="min-h-[44px] rounded-xl border-[1.5px] border-line px-4 text-xs font-bold text-ink disabled:opacity-40 cursor-pointer"
          >
            Sebelumnya
          </button>
          <span className="text-xs text-muted num-tabular">
            {current} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
            className="min-h-[44px] rounded-xl border-[1.5px] border-line px-4 text-xs font-bold text-ink disabled:opacity-40 cursor-pointer"
          >
            Berikutnya
          </button>
        </div>
      )}

      {/* Modal form */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink">
                {form.id ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
              <button
                type="button"
                onClick={() => setForm(null)}
                aria-label="Tutup"
                className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface cursor-pointer"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className={LABEL} htmlFor="p-name">
                  Nama Produk
                </label>
                <input
                  id="p-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Pulsa 10.000"
                  className={FIELD}
                />
                <p className="mt-1 text-[11px] text-muted">
                  Slug: <span className="num-tabular">{slugify(form.name) || '—'}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="p-cat">
                    Kategori
                  </label>
                  <select
                    id="p-cat"
                    required
                    value={form.categoryUuid}
                    onChange={(e) => setForm({ ...form, categoryUuid: e.target.value, providerId: '' })}
                    className={FIELD}
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.uuid} value={c.id}>
                        {c.name}
                        {c.isActive ? '' : ' (nonaktif)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL} htmlFor="p-prov">
                    Provider / Operator
                  </label>
                  <select
                    id="p-prov"
                    value={form.providerId}
                    onChange={(e) => setForm({ ...form, providerId: e.target.value })}
                    className={FIELD}
                  >
                    <option value="">— Tanpa provider —</option>
                    {providerOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {providerOptions.length === 0 && form.categoryUuid && (
                    <p className="mt-1 text-[11px] text-muted">
                      Belum ada provider untuk kategori ini — tambahkan di halaman Kategori.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="p-sku">
                    SKU
                  </label>
                  <input
                    id="p-sku"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="TSEL-P10000"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="p-badge">
                    Badge
                  </label>
                  <select
                    id="p-badge"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className={FIELD}
                  >
                    <option value="">Tanpa badge</option>
                    <option value="POPULER">POPULER</option>
                    <option value="HEMAT">HEMAT</option>
                    <option value="PROMO">PROMO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="p-nom">
                    Nominal / Varian
                  </label>
                  <input
                    id="p-nom"
                    value={form.nominalLabel}
                    onChange={(e) => setForm({ ...form, nominalLabel: e.target.value })}
                    placeholder="10.000"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="p-note">
                    Catatan Nominal
                  </label>
                  <input
                    id="p-note"
                    value={form.nominalNote}
                    onChange={(e) => setForm({ ...form, nominalNote: e.target.value })}
                    placeholder="Aktif +15 hari"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="p-cost">
                    Harga Modal (Rp)
                  </label>
                  <input
                    id="p-cost"
                    type="number"
                    min="0"
                    value={form.costPrice}
                    onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="p-price">
                    Harga Jual (Rp)
                  </label>
                  <input
                    id="p-price"
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="p-desc">
                  Deskripsi
                </label>
                <textarea
                  id="p-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${FIELD} py-2.5`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="p-order">
                    Urutan Tampil
                  </label>
                  <input
                    id="p-order"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="h-5 w-5 rounded border-line accent-accent"
                    />
                    Produk aktif (tampil di storefront)
                  </label>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-xs font-medium text-gold">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="min-h-[44px] rounded-xl border-[1.5px] border-line px-5 text-sm font-semibold text-ink cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-60 cursor-pointer"
                >
                  <Icon name="save" className="h-4 w-4" />
                  {form.id ? 'Simpan Perubahan' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
      active ? 'bg-accent-soft text-accent' : 'bg-surface text-muted'
    }`}
  >
    {active ? 'Aktif' : 'Nonaktif'}
  </span>
);

const RowActions: React.FC<{
  product: ProductView;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ product, busy, onEdit, onToggle, onDelete }) => (
  <div className="flex justify-end gap-2">
    <button
      type="button"
      onClick={onEdit}
      className="min-h-[36px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink hover:border-accent hover:text-accent cursor-pointer"
    >
      Edit
    </button>
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className="min-h-[36px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink disabled:opacity-50 hover:border-accent hover:text-accent cursor-pointer"
    >
      {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
    </button>
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label="Hapus produk"
      className="grid min-h-[36px] w-9 place-items-center rounded-lg border-[1.5px] border-line text-gold disabled:opacity-50 hover:border-gold cursor-pointer"
    >
      <Icon name="trash" className="h-3.5 w-3.5" />
    </button>
  </div>
);
