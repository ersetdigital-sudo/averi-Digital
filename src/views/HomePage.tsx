'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceId } from '../types';
import { BRAND } from '../lib/config';
import { Hero } from '../components/Hero';
import { PromoMosaic } from '../components/PromoMosaic';
import { ProductMarketplace, FilterKey } from '../components/ProductMarketplace';
import { StepsTimeline } from '../components/StepsTimeline';
import { SupportBand } from '../components/SupportBand';
import { Icon, IconName } from '../components/Icon';

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

/**
 * Beranda = halaman **jajual** (browse) saja.
 *
 * Wizard checkout tidak lagi dibenamkan di sini supaya alur tidak terasa
 * berat. Semua tombol yang memicu transaksi ber Navigasi ke `/checkout`
 * dengan pilihan sudah terkirim lewat query string
 * (`?service=&prov=&nom=`).
 */
export const HomePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [catalogFilter, setCatalogFilter] = useState<FilterKey>('semua');
  // Lazy-init LANGSUNG dari searchParams supaya nilainya ada di SSR HTML
  // maupun saat hydrate (nilai yang sama di server & client).
  const [catalogQuery, setCatalogQuery] = useState<string | undefined>(
    () => searchParams.get('q') ?? undefined
  );

  /** Pindah ke halaman checkout dengan pilihan terkunci. */
  const goCheckout = (service?: ServiceId, providerId?: string, nominalId?: string) => {
    const qs = new URLSearchParams();
    if (service) qs.set('service', service);
    if (providerId) qs.set('prov', providerId);
    if (nominalId) qs.set('nom', nominalId);
    const query = qs.toString();
    router.push(query ? `/checkout?${query}` : '/checkout');
  };

  /** Chip populer / hasil pencarian di hero. */
  const quickPick = (service: ServiceId, nominalId: string) =>
    goCheckout(service, undefined, nominalId);

  /** Tombol "Beli" di katalog -> provider ikut terkunci. */
  const buy = (service: ServiceId, providerId: string, nominalId: string) =>
    goCheckout(service, providerId, nominalId);

  /** Tombol lanjut di katalog: buka halaman checkout (bukan scroll ke wizard lagi). */
  const browseAll = () => goCheckout();

  /** Scroll ke grid katalog (dipakai hero & tombol promo). */
  const scrollToCatalog = () => {
    document
      .getElementById('katalog')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Query `?q=` dari search bar header.
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setCatalogQuery(qParam);
  }, [searchParams]);

  // Scroll ke seksi hash apa pun saat pertama dibuka (mis. /#katalog).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.length < 2) return;
    const id = hash.substring(1);
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* 1. Hero — cari produk / pilih cepat */}
      <div className="shell">
        <Hero onQuickPick={quickPick} onBrowse={scrollToCatalog} />
      </div>

      {/* 2. Promo mosaic */}
      <PromoMosaic onBrowse={scrollToCatalog} onGo={goCheckout} />

      {/* 3. Katalog: filter + sort + pencarian + grid */}
      <ProductMarketplace
        filter={catalogFilter}
        onFilter={setCatalogFilter}
        onBuy={buy}
        onBrowseAll={browseAll}
        initialQuery={catalogQuery}
      />

      {/* 4. Keunggulan */}
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

      {/* 5. Cara transaksi */}
      <StepsTimeline />

      {/* 6. Band bantuan */}
      <SupportBand />
    </>
  );
};