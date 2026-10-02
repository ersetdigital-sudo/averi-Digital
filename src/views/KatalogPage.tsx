'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { CategoryMeta, ProductView } from '../types';
import { ProductGrid } from '../components/ProductCard';
import { Icon } from '../components/Icon';

type Sort = 'populer' | 'harga-asc' | 'harga-desc';

/** Halaman /katalog — filter kategori + pencarian + grid 4/3/2 kolom. */
export const KatalogPage: React.FC<{
  categories: CategoryMeta[];
  products: ProductView[];
}> = ({ categories, products: allProducts }) => {
  const searchParams = useSearchParams();

  const catParam = searchParams.get('cat');
  const initialCat =
    catParam && categories.some((c) => c.id === catParam) ? catParam : 'semua';
  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [sort, setSort] = useState<Sort>('populer');

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allProducts.filter((p) => cat === 'semua' || p.category === cat);
    if (q) {
      return list
        .filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.providerName.toLowerCase().includes(q) ||
            v.nominalLabel.toLowerCase().includes(q) ||
            v.categoryName.toLowerCase().includes(q)
        )
        .sort((a, b) => b.popularity - a.popularity);
    }
    return list.sort((a, b) => {
      if (sort === 'harga-asc') return a.price - b.price;
      if (sort === 'harga-desc') return b.price - a.price;
      return b.popularity - a.popularity;
    });
  }, [allProducts, cat, query, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Kepala halaman */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            Katalog
          </span>
          <h1 className="mt-1.5 text-[26px] sm:text-[38px] font-extrabold tracking-[-0.035em] text-ink">
            Pilihan Produk
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Semua kebutuhan digital dalam satu tempat.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted num-tabular">
          {products.length} produk ditampilkan
        </span>
      </div>

      {/* Bar filter: chips kategori + pencarian + urutkan */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-3 flex flex-col gap-3 sm:mt-7 sm:p-4 sm:gap-3.5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat('semua')}
            className={`h-9 px-3 sm:h-10 sm:px-4 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
              cat === 'semua' ? 'bg-ink text-white' : 'bg-surface text-ink-soft hover:bg-line'
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`h-9 px-3 sm:h-10 sm:px-4 rounded-lg text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                cat === c.id ? 'bg-ink text-white' : 'bg-surface text-ink-soft hover:bg-line'
              }`}
            >
              <Icon name={c.icon} className="w-4 h-4" />
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 h-12 rounded-xl border-[1.5px] border-line bg-white px-4 focus-within:border-accent transition-colors">
            <Icon name="search" className="w-4.5 h-4.5 text-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk, provider, atau nominal..."
              aria-label="Cari produk"
              className="flex-1 min-w-0 bg-transparent text-sm font-medium text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
          <div className="relative sm:w-52 shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Urutkan produk"
              className="w-full h-12 rounded-xl border-[1.5px] border-line bg-white px-4 text-sm font-semibold text-ink focus:outline-none focus:border-accent appearance-none cursor-pointer"
            >
              <option value="populer">Paling Populer</option>
              <option value="harga-asc">Harga Terendah</option>
              <option value="harga-desc">Harga Tertinggi</option>
            </select>
            <Icon
              name="chevron_down"
              className="w-4 h-4 text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="mt-7">
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface py-14 text-center">
          <Icon name="search" className="w-8 h-8 text-muted mx-auto" />
          <p className="mt-3 text-sm font-bold text-ink">Produk tidak ditemukan</p>
          <p className="mt-1 text-xs text-muted">Coba kata kunci atau kategori lain.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCat('semua');
            }}
            className="mt-5 h-11 px-5 rounded-xl bg-ink text-white text-xs font-semibold cursor-pointer hover:bg-ink-soft transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Footer note */}
      <p className="mt-8 text-center text-xs text-muted">
        Butuh produk lain?{' '}
        <Link href="/hubungi-kami" className="font-semibold text-accent hover:underline">
          Hubungi kami
        </Link>{' '}
        — CS siap membantu setiap hari.
      </p>
    </div>
  );
};
