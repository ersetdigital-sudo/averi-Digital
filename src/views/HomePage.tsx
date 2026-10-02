'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BRAND } from '../lib/config';
import { Hero } from '../components/Hero';
import { CategoryNav } from '../components/CategoryNav';
import { ProductGrid } from '../components/ProductCard';
import { PromoMosaic } from '../components/PromoMosaic';
import { PromoBanner } from '../components/PromoBanner';
import { StepsTimeline } from '../components/StepsTimeline';
import { SupportBand } from '../components/SupportBand';
import { Icon, IconName } from '../components/Icon';
import { resolveProductView, topProducts } from '../data/catalog';

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'wallet',
    title: 'Tanpa biaya admin',
    body: 'Harga yang kamu lihat adalah harga yang kamu bayar. Tidak ada potongan tersembunyi.',
  },
  {
    icon: 'shield',
    title: 'Nomor tujuan aman',
    body: 'Riwayat transaksi & nomor tujuan disamarkan saat diperiksa, jadi tidak bisa diintip.',
  },
  {
    icon: 'chat',
    title: 'Bantuan cepat',
    body: `CS WhatsApp siap membantu setiap hari pukul ${BRAND.csHours}.`,
  },
];

/** Beranda: hero + 8 kategori + produk terlaris (grid 4 kolom) + promo. */
export const HomePage: React.FC = () => {
  useSearchParams(); // situs dirender force-dynamic; jaga konsistensi client render

  const best = topProducts(8).map(resolveProductView);

  return (
    <>
      {/* 1. Hero asimetris + satu search bar */}
      <Hero />

      {/* 1b. Banner promo cashback */}
      <div className="mt-6">
        <PromoBanner />
      </div>

      {/* 2. Pilihan Produk — 8 kategori wajib */}
      <CategoryNav />

      {/* 3. Produk terlaris — grid 4 kolom */}
      <section className="shell pb-14">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              Paling Dicari
            </span>
            <h2 className="mt-2 text-2xl sm:text-[30px] font-extrabold tracking-[-0.03em] text-ink">
              Produk Terlaris
            </h2>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border-[1.5px] border-line text-ink text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
          >
            Lihat Semua
            <Icon name="arrow_right" className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={best} />
      </section>

      {/* 4. Promo */}
      <PromoMosaic />

      {/* 5. Keunggulan */}
      <section className="shell pb-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-line bg-white p-5">
            <span className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
              <Icon name={f.icon} className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-ink mt-3">{f.title}</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      {/* 6. Cara transaksi */}
      <StepsTimeline />

      {/* 7. Band bantuan */}
      <SupportBand />
    </>
  );
};
