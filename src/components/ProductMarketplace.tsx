'use client';

import React, { useMemo, useState } from 'react';
import { ServiceId, NominalTag } from '../types';
import { PRODUCTS, resolveProduct } from '../data/catalog';
import { rupiah } from '../lib/config';
import { Icon } from './Icon';

type SortKey = 'populer' | 'murah' | 'mahal';

/**
 * Filter katalog (ringkas). **8 kategori detail** ada di langkah 1 wizard,
 * bukan di sini.
 */
export type FilterKey = ServiceId | 'semua';

const FILTERS: { label: string; value: FilterKey }[] = [
  { label: 'Semua', value: 'semua' },
  { label: 'Pulsa', value: 'pulsa' },
  { label: 'Paket Data', value: 'data' },
  { label: 'PLN', value: 'pln' },
  { label: 'E-Wallet', value: 'ewallet' },
  { label: 'Tagihan', value: 'tagihan' },
];

const SORTS: { label: string; value: SortKey }[] = [
  { label: 'Terpopuler', value: 'populer' },
  { label: 'Harga Terendah', value: 'murah' },
  { label: 'Harga Tertinggi', value: 'mahal' },
];

const BADGE: Record<NominalTag, string> = {
  POPULER: 'bg-accent text-white',
  HEMAT: 'bg-gold text-[#4a3800]',
  PROMO: 'bg-ink/10 text-ink',
};

const LABEL: string =
  'block text-[11px] font-bold uppercase tracking-[0.1em] text-muted';

interface Props {
  filter: FilterKey;
  onFilter: (value: FilterKey) => void;
  /** "Beli" diklik -> isi wizard lalu lompat ke langkah nomor tujuan. */
  onBuy: (service: ServiceId, providerId: string, nominalId: string) => void;
  onBrowseAll: () => void;
  /** Query awal dari search bar di header (`/?q=...`). */
  initialQuery?: string;
}

/**
 * Katalog produk dengan struktur **sidebar kiri + grid kanan**
 * (berbeda dari prototype Nexa yang memakai toolbar atas + grid 4 kolom).
 *
 * - Sidebar (sticky): pencarian, daftar kategori vertikal berjumla, pengurutan.
 * - Area kanan: bar ringkasan hasil, grid 3 kolom, empty state, tombol lanjut.
 */
export const ProductMarketplace: React.FC<Props> = ({
  filter,
  onFilter,
  onBuy,
  onBrowseAll,
  initialQuery,
}) => {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [sort, setSort] = useState<SortKey>('populer');

  // Sinkronkan hanya saat nilai awal dari URL berubah (mis. navigasi header search).
  // Dilindungi agar tidak menimpa ketikan user yang sedang aktif.
  const initialRef = React.useRef<string | undefined>(initialQuery);
  if (initialRef.current !== initialQuery) {
    initialRef.current = initialQuery;
    if (typeof initialQuery === 'string') setQuery(initialQuery);
  }

  // Jumlah produk per kategori (untuk badge hitung di sidebar).
  const counts = useMemo(() => {
    const map: Record<string, number> = { semua: PRODUCTS.length };
    for (const p of PRODUCTS) map[p.service] = (map[p.service] ?? 0) + 1;
    return map;
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = PRODUCTS.map((p) => ({ p, view: resolveProduct(p) })).filter(({ p, view }) => {
      const okCat = filter === 'semua' || p.service === filter;
      const hay =
        `${view.providerName} ${p.name} ${p.desc} ${view.nominalLabel} ${view.serviceShort}`.toLowerCase();
      return okCat && (q === '' || hay.includes(q));
    });

    rows.sort((a, b) => {
      if (sort === 'murah') return a.view.price - b.view.price;
      if (sort === 'mahal') return b.view.price - a.view.price;
      return b.p.popularity - a.p.popularity;
    });

    return rows;
  }, [filter, query, sort]);

  const hasReset = filter !== 'semua' || query.trim() !== '';
  const reset = () => {
    onFilter('semua');
    setQuery('');
  };

  const activeLabel = FILTERS.find((f) => f.value === filter)?.label ?? 'Semua';

  return (
    <section className="bg-surface py-14" id="katalog">
      <div className="shell">
        {/* Kepala seksi */}
        <div className="max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
            Katalog Produk
          </span>
          <h2 className="mt-2 text-2xl sm:text-[34px] font-extrabold tracking-tight text-ink">
            Produk Digital Pilihan
          </h2>
          <p className="mt-2 text-sm text-muted">
            Temukan layanan dan nominal yang sesuai kebutuhanmu.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[248px_1fr] gap-8">
          {/* ---------- Sidebar kiri (sticky) ---------- */}
          <aside className="lg:sticky lg:top-[92px] lg:self-start space-y-7">
            {/* Cari */}
            <div>
              <span className={LABEL}>Cari produk</span>
              <label className="mt-2 flex items-center gap-2 h-11 px-3 rounded-xl border-[1.5px] border-line bg-white focus-within:border-ink transition-colors">
                <Icon name="search" className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari di katalog"
                  aria-label="Cari di katalog"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-ink placeholder:text-muted"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Bersihkan pencarian"
                    className="text-muted hover:text-ink shrink-0 cursor-pointer"
                  >
                    <Icon name="close" className="w-4 h-4" />
                  </button>
                )}
              </label>
            </div>

            {/* Kategori vertikal + jumlah */}
            <div>
              <span className={LABEL}>Kategori</span>
              <ul className="mt-2 space-y-1.5">
                {FILTERS.map((f) => {
                  const active = filter === f.value;
                  return (
                    <li key={f.value}>
                      <button
                        type="button"
                        onClick={() => onFilter(f.value)}
                        aria-pressed={active}
                        className={`w-full flex items-center justify-between gap-3 h-10 px-3 rounded-lg border-[1.5px] text-sm font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-ink border-ink text-white'
                            : 'bg-white border-line text-ink-soft hover:border-ink'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span
                          className={`text-[11px] font-bold px-1.5 py-0.5 rounded num-tabular ${
                            active ? 'bg-white/20 text-white' : 'bg-surface text-muted'
                          }`}
                        >
                          {counts[f.value] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Urutkan */}
            <div>
              <span className={LABEL}>Urutkan</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Urutkan produk"
                className="mt-2 w-full h-11 px-3 rounded-xl border-[1.5px] border-line bg-white text-sm font-semibold text-ink cursor-pointer focus:outline-none focus:border-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bantuan singkat */}
            <div className="p-4 rounded-xl bg-white border border-line">
              <p className="text-xs font-bold text-ink">Butuh bantuan memilih?</p>
              <p className="text-[11px] text-muted mt-1 leading-relaxed">
                Chat CS kami untuk cek stok atau nominal khusus.
              </p>
            </div>
          </aside>

          {/* ---------- Area hasil kanan ---------- */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-line">
              <p className="text-sm text-muted">
                <b className="text-ink font-extrabold num-tabular">{list.length}</b> produk
                ditemukan
                {filter !== 'semua' && (
                  <>
                    {' '}
                    · kategori <span className="text-accent font-bold">{activeLabel}</span>
                  </>
                )}
              </p>

              {hasReset && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-ink transition-colors cursor-pointer"
                >
                  <Icon name="close" className="w-3.5 h-3.5" />
                  Reset filter
                </button>
              )}
            </div>

            {list.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-line bg-white py-14 px-6 text-center">
                <Icon name="search" className="w-8 h-8 text-muted mx-auto" />
                <p className="mt-3 text-sm font-bold text-ink">Produk tidak ditemukan</p>
                <p className="text-xs text-muted mt-1">Coba kata kunci atau kategori lain.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 h-10 px-5 rounded-lg bg-accent hover:bg-accent-dark text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map(({ p, view }) => (
                  <article
                    key={p.id}
                    className="rounded-xl border-[1.5px] border-line bg-white p-4 flex flex-col gap-2.5 transition-all hover:border-ink hover:shadow-md hover:-translate-y-[3px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: view.providerSwatch }}
                          aria-hidden="true"
                        />
                        <span className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-ink truncate">
                          {view.providerName}
                        </span>
                      </span>
                      {p.badge && (
                        <span
                          className={`text-[10.5px] font-extrabold uppercase tracking-[0.08em] px-2 py-1 rounded-md shrink-0 ${BADGE[p.badge]}`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[17px] font-extrabold tracking-tight text-ink leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-[13px] text-muted leading-relaxed">{p.desc}</p>

                    <span className="self-start text-[13px] font-bold text-ink bg-surface border border-line rounded-md px-2.5 py-1 num-tabular">
                      {view.nominalLabel}
                    </span>

                    <div className="mt-1.5 pt-3 border-t border-line flex items-center justify-between gap-3">
                      <span className="text-xl font-extrabold tracking-tight text-ink num-tabular">
                        {rupiah(view.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onBuy(p.service, p.providerId, p.nominalId)}
                        className="h-[38px] px-4 rounded-lg bg-accent hover:bg-ink text-white font-bold text-[13.5px] transition-colors cursor-pointer"
                      >
                        Beli
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={onBrowseAll}
                className="text-sm font-bold text-accent hover:text-ink transition-colors cursor-pointer"
              >
                Mulai transaksi →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};