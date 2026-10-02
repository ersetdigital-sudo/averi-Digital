'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminCategory, AdminProvider } from '@/lib/catalog';
import {
  saveCategory,
  setCategoryActive,
  deleteCategory,
  saveProvider,
  setProviderActive,
  deleteProvider,
} from '@/app/actions/catalog';
import { ICON_OPTIONS } from '@/lib/icons';
import { Icon } from '../Icon';

interface Props {
  categories: AdminCategory[];
  counts: Record<string, number>;
  providers: AdminProvider[];
}

interface CatForm {
  id?: string;
  uuid?: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  productPrefix: string;
  isBill: boolean;
  destLabel: string;
  destPlaceholder: string;
  destHint: string;
  phoneInput: boolean;
  minDigits: string;
  maxDigits: string;
  sortOrder: string;
  isActive: boolean;
}

const FIELD =
  'w-full min-h-[44px] rounded-xl border-[1.5px] border-line bg-white px-3.5 text-sm text-ink outline-none transition focus:border-accent placeholder:text-muted';
const LABEL = 'mb-1.5 block text-xs font-bold text-ink';

const emptyCategory = (order: number): CatForm => ({
  name: '',
  short: '',
  blurb: '',
  icon: 'receipt',
  productPrefix: '',
  isBill: false,
  destLabel: 'Nomor tujuan',
  destPlaceholder: '',
  destHint: '',
  phoneInput: false,
  minDigits: '6',
  maxDigits: '16',
  sortOrder: String(order),
  isActive: true,
});

export const CategoriesManager: React.FC<Props> = ({ categories, counts, providers }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<CatForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerFor, setProviderFor] = useState<AdminCategory | null>(null);

  const openNew = () => {
    setError(null);
    setForm(emptyCategory(categories.length + 1));
  };

  const openEdit = (c: AdminCategory) => {
    setError(null);
    setForm({
      id: c.uuid,
      uuid: c.uuid,
      name: c.name,
      short: c.short,
      blurb: c.blurb,
      icon: c.icon,
      productPrefix: c.productPrefix,
      isBill: c.isBill,
      destLabel: c.destLabel,
      destPlaceholder: c.destPlaceholder,
      destHint: c.destHint,
      phoneInput: c.phoneInput,
      minDigits: String(c.minDigits),
      maxDigits: String(c.maxDigits),
      sortOrder: String(c.sortOrder),
      isActive: c.isActive,
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    startTransition(async () => {
      const result = await saveCategory({
        id: form.id,
        name: form.name,
        short: form.short,
        blurb: form.blurb,
        icon: form.icon,
        productPrefix: form.productPrefix,
        isBill: form.isBill,
        destLabel: form.destLabel,
        destPlaceholder: form.destPlaceholder,
        destHint: form.destHint,
        phoneInput: form.phoneInput,
        minDigits: Number(form.minDigits) || 1,
        maxDigits: Number(form.maxDigits) || 1,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      });
      if (!result.ok) {
        setError(result.error ?? 'Gagal menyimpan kategori.');
        return;
      }
      setForm(null);
      router.refresh();
    });
  };

  const toggle = (c: AdminCategory) => {
    startTransition(async () => {
      await setCategoryActive(c.uuid, !c.isActive);
      router.refresh();
    });
  };

  const remove = (c: AdminCategory) => {
    if (!window.confirm(`Hapus kategori "${c.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategory(c.uuid);
      if (!result.ok) window.alert(result.error ?? 'Gagal menghapus kategori.');
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
        <p className="text-xs text-muted num-tabular">{categories.length} kategori</p>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:bg-accent-dark cursor-pointer"
        >
          <Icon name="spark" className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.uuid} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{c.name}</p>
                <p className="truncate text-[11px] text-muted">
                  {c.id} · {counts[c.id] ?? 0} produk
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  c.isActive ? 'bg-accent-soft text-accent' : 'bg-surface text-muted'
                }`}
              >
                {c.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            <p className="mt-3 text-xs text-muted line-clamp-2">{c.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openEdit(c)}
                className="min-h-[40px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink hover:border-accent hover:text-accent cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setProviderFor(c)}
                className="min-h-[40px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink hover:border-accent hover:text-accent cursor-pointer"
              >
                Provider ({providers.filter((p) => p.categorySlug === c.id).length})
              </button>
              <button
                type="button"
                onClick={() => toggle(c)}
                disabled={pending}
                className="min-h-[40px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink disabled:opacity-50 cursor-pointer"
              >
                {c.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button
                type="button"
                onClick={() => remove(c)}
                disabled={pending}
                className="grid min-h-[40px] w-10 place-items-center rounded-lg border-[1.5px] border-line text-gold disabled:opacity-50 cursor-pointer"
                aria-label="Hapus kategori"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <Modal title={form.id ? 'Edit Kategori' : 'Tambah Kategori'} onClose={() => setForm(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="c-name">Nama Kategori</label>
                <input
                  id="c-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Pulsa"
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="c-short">Nama Pendek</label>
                <input
                  id="c-short"
                  value={form.short}
                  onChange={(e) => setForm({ ...form, short: e.target.value })}
                  className={FIELD}
                />
              </div>
            </div>

            <div>
              <label className={LABEL} htmlFor="c-blurb">Deskripsi Singkat</label>
              <input
                id="c-blurb"
                value={form.blurb}
                onChange={(e) => setForm({ ...form, blurb: e.target.value })}
                placeholder="Isi ulang pulsa semua operator"
                className={FIELD}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="c-icon">Ikon</label>
                <select
                  id="c-icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className={FIELD}
                >
                  {ICON_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL} htmlFor="c-prefix">Awalan Nama Produk</label>
                <input
                  id="c-prefix"
                  value={form.productPrefix}
                  onChange={(e) => setForm({ ...form, productPrefix: e.target.value })}
                  placeholder="Pulsa"
                  className={FIELD}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="c-dest">Label Nomor Tujuan</label>
                <input
                  id="c-dest"
                  value={form.destLabel}
                  onChange={(e) => setForm({ ...form, destLabel: e.target.value })}
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="c-ph">Placeholder Nomor</label>
                <input
                  id="c-ph"
                  value={form.destPlaceholder}
                  onChange={(e) => setForm({ ...form, destPlaceholder: e.target.value })}
                  className={FIELD}
                />
              </div>
            </div>

            <div>
              <label className={LABEL} htmlFor="c-hint">Petunjuk Nomor</label>
              <input
                id="c-hint"
                value={form.destHint}
                onChange={(e) => setForm({ ...form, destHint: e.target.value })}
                className={FIELD}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className={LABEL} htmlFor="c-min">Min Digit</label>
                <input
                  id="c-min"
                  type="number"
                  value={form.minDigits}
                  onChange={(e) => setForm({ ...form, minDigits: e.target.value })}
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="c-max">Max Digit</label>
                <input
                  id="c-max"
                  type="number"
                  value={form.maxDigits}
                  onChange={(e) => setForm({ ...form, maxDigits: e.target.value })}
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="c-order">Urutan</label>
                <input
                  id="c-order"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className={FIELD}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={form.phoneInput}
                  onChange={(e) => setForm({ ...form, phoneInput: e.target.checked })}
                  className="h-5 w-5 accent-accent"
                />
                Nomor handphone (08…)
              </label>
              <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={form.isBill}
                  onChange={(e) => setForm({ ...form, isBill: e.target.checked })}
                  className="h-5 w-5 accent-accent"
                />
                Kategori tagihan
              </label>
              <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-5 w-5 accent-accent"
                />
                Aktif
              </label>
            </div>

            {error && (
              <p className="rounded-xl border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-xs font-medium text-gold">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <ModalCancel onClick={() => setForm(null)} />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-60 cursor-pointer"
              >
                <Icon name="save" className="h-4 w-4" />
                Simpan Kategori
              </button>
            </div>
          </form>
        </Modal>
      )}

      {providerFor && (
        <ProviderPanel
          category={providerFor}
          providers={providers.filter((p) => p.categorySlug === providerFor.id)}
          onClose={() => setProviderFor(null)}
          onChanged={() => router.refresh()}
        />
      )}
    </div>
  );
};

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface cursor-pointer"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ModalCancel: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-[44px] rounded-xl border-[1.5px] border-line px-5 text-sm font-semibold text-ink cursor-pointer"
  >
    Batal
  </button>
);

/* ------------------------------------------------------------------ *
 * Panel provider per kategori
 * ------------------------------------------------------------------ */

const ProviderPanel: React.FC<{
  category: AdminCategory;
  providers: AdminProvider[];
  onClose: () => void;
  onChanged: () => void;
}> = ({ category, providers, onClose, onChanged }) => {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [swatch, setSwatch] = useState('#006491');
  const [error, setError] = useState<string | null>(null);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveProvider({
        categoryId: category.uuid,
        name,
        code,
        swatch,
        sortOrder: providers.length + 1,
        isActive: true,
      });
      if (!result.ok) {
        setError(result.error ?? 'Gagal menambah provider.');
        return;
      }
      setName('');
      setCode('');
      onChanged();
    });
  };

  const toggle = (p: AdminProvider) => {
    startTransition(async () => {
      await setProviderActive(p.id, !p.isActive);
      onChanged();
    });
  };

  const remove = (p: AdminProvider) => {
    if (!window.confirm(`Hapus provider "${p.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteProvider(p.id);
      if (!result.ok) window.alert(result.error ?? 'Gagal menghapus provider.');
      onChanged();
    });
  };

  return (
    <Modal title={`Provider · ${category.name}`} onClose={onClose}>
      <div className="space-y-4">
        <ul className="divide-y divide-line rounded-xl border border-line">
          {providers.length === 0 ? (
            <li className="p-4 text-center text-xs text-muted">Belum ada provider.</li>
          ) : (
            providers.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: p.swatch }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">{p.name}</p>
                  <p className="text-[11px] text-muted num-tabular">
                    {p.slug}
                    {p.code ? ` · ${p.code}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p)}
                  disabled={pending}
                  className="min-h-[36px] rounded-lg border-[1.5px] border-line px-3 text-xs font-bold text-ink disabled:opacity-50 cursor-pointer"
                >
                  {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={pending}
                  aria-label="Hapus provider"
                  className="grid min-h-[36px] w-9 place-items-center rounded-lg border-[1.5px] border-line text-gold disabled:opacity-50 cursor-pointer"
                >
                  <Icon name="trash" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama provider (mis. Telkomsel)"
            className={FIELD}
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Kode"
            className={`${FIELD} sm:w-28`}
          />
          <input
            type="color"
            value={swatch}
            onChange={(e) => setSwatch(e.target.value)}
            aria-label="Warna provider"
            className="h-[44px] w-full rounded-xl border-[1.5px] border-line bg-white px-2 sm:w-16"
          />
          <button
            type="submit"
            disabled={pending}
            className="min-h-[44px] rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-60 cursor-pointer"
          >
            Tambah
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-xs font-medium text-gold">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
};

