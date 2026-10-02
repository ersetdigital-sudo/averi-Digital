'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { CATEGORIES, CATEGORY_ORDER } from '../data/catalog';

/**
 * Seksi "Pilihan Produk" — navigasi 8 kategori wajib.
 * Desain unik situs ini: baris geometris bernomor 01–08, bukan kartu biasa.
 */
export const CategoryNav: React.FC = () => (
  <section className="shell py-14" id="kategori">
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
          08 Kategori
        </span>
        <h2 className="mt-2 text-2xl sm:text-[34px] font-extrabold tracking-[-0.03em] text-ink">
          Pilihan Produk
        </h2>
        <p className="mt-2 text-sm text-muted">
          Semua kebutuhan digital dalam satu tempat.
        </p>
      </div>
      <Link
        href="/katalog"
        className="hidden sm:inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-ink-soft transition-colors shrink-0"
      >
        Lihat Katalog
        <Icon name="arrow_right" className="w-4 h-4" />
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
      {CATEGORY_ORDER.map((id, i) => {
        const cat = CATEGORIES.find((c) => c.id === id)!;
        const n = String(i + 1).padStart(2, '0');
        return (
          <Link
            key={id}
            href={`/katalog?cat=${id}`}
            className="group relative border-r border-b border-line bg-white p-5 hover:bg-surface transition-colors min-h-[44px]"
          >
            <span className="absolute top-4 right-4 text-[11px] font-bold num-tabular text-muted group-hover:text-gold transition-colors">
              {n}
            </span>
            <span className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center group-hover:bg-accent group-hover:text-white transition-colors">
              <Icon name={cat.icon} className="w-5 h-5" />
            </span>
            <h3 className="mt-3.5 text-sm font-bold text-ink tracking-tight">{cat.name}</h3>
            <p className="mt-1 text-xs text-muted leading-relaxed">{cat.blurb}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              Belanja
              <Icon
                name="chevron_right"
                className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        );
      })}
    </div>
  </section>
);
