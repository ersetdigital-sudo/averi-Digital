'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';

/**
 * Hero beranda — asimetris & geometris (identitas situs ini).
 * ONE search bar + CTA merah. Visual kanan: komposisi teal/merah/putih.
 */
export const Hero: React.FC = () => {
  const router = useRouter();
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/katalog?q=${encodeURIComponent(query)}` : '/katalog');
  };

  return (
    <section className="border-b border-line overflow-hidden">
      <div className="shell grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-10 lg:gap-8 py-12 lg:py-16">
        {/* ---------- Kolom kiri: teks editorial ---------- */}
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            <span className="w-6 h-[3px] bg-accent rounded-full" />
            Marketplace Produk Digital
          </span>

          <h1 className="mt-5 font-sans font-extrabold text-ink text-[38px] leading-[1.04] sm:text-[52px] lg:text-[58px] tracking-[-0.035em]">
            Semua Kebutuhan
            <br />
            Digital,
            <br />
            Selesai dalam{' '}
            <span className="text-gold">Sekejap.</span>
          </h1>

          <p className="mt-5 text-[15px] text-ink-soft leading-relaxed max-w-[46ch]">
            Pulsa, paket data, PLN, pembayaran internet, uang elektronik, dan kebutuhan digital
            lainnya dalam satu tempat.
          </p>

          {/* Satu-satunya search bar */}
          <form
            onSubmit={submit}
            className="mt-7 flex items-center gap-2 max-w-[520px] rounded-2xl border-[1.5px] border-line bg-white p-1.5 shadow-sm focus-within:border-accent transition-colors"
          >
            <span className="pl-3 text-muted">
              <Icon name="search" className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari produk, provider, atau nominal..."
              aria-label="Cari produk"
              className="flex-1 min-w-0 h-12 bg-transparent text-[15px] font-medium text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 px-5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Cari Produk
            </button>
          </form>

          <p className="mt-4 text-xs text-muted">
            Pembayaran QRIS · Diproses otomatis · Tanpa biaya admin
          </p>
        </div>

        {/* ---------- Kolom kanan: komposisi geometris premium ---------- */}
        <div className="relative h-[340px] sm:h-[420px] lg:h-[460px]" aria-hidden="true">
          {/* Blok teal besar */}
          <div className="absolute inset-y-4 left-0 right-6 rounded-[28px] bg-accent rotate-[-2deg]">
            {/* Grid garis dekoratif */}
            <div className="absolute inset-0 rounded-[28px] overflow-hidden opacity-20">
              <div className="absolute left-10 top-0 bottom-0 w-px bg-white" />
              <div className="absolute left-24 top-0 bottom-0 w-px bg-white" />
              <div className="absolute top-10 left-0 right-0 h-px bg-white" />
            </div>
            {/* Label editor di dalam blok */}
            <span className="absolute top-7 left-9 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              Topupin · Digital
            </span>
            <span className="absolute bottom-8 left-9 text-white font-extrabold text-[56px] leading-none tracking-[-0.04em]">
              24<span className="text-gold">/7</span>
            </span>
          </div>

          {/* Kotak merah */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-3xl bg-gold rotate-6" />
          <div className="absolute bottom-6 right-2 w-16 h-16 rounded-2xl border-[3px] border-gold rotate-[-8deg] bg-transparent" />

          {/* Kartu produk melayang */}
          <div className="absolute top-16 right-4 sm:right-10 w-[230px] rounded-2xl bg-white p-4 shadow-xl rotate-[2deg]">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-accent-soft text-accent grid place-items-center">
                <Icon name="call" className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Pulsa 25.000
                </p>
                <p className="text-sm font-bold text-ink num-tabular">Rp26.500</p>
              </div>
            </div>
            <div className="mt-3 h-9 rounded-lg bg-gold text-white text-xs font-semibold grid place-items-center">
              Beli Sekarang
            </div>
          </div>

          <div className="absolute bottom-20 right-0 sm:right-6 w-[210px] rounded-2xl bg-white p-4 shadow-xl rotate-[-3deg]">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gold-soft text-gold grid place-items-center">
                <Icon name="bolt" className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Token PLN
                </p>
                <p className="text-sm font-bold text-ink num-tabular">Rp102.500</p>
              </div>
            </div>
          </div>

          <div className="absolute top-6 left-4 sm:left-8 w-[150px] rounded-2xl bg-ink p-4 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Uang Elektronik
            </p>
            <p className="text-lg font-extrabold text-white num-tabular mt-1">Rp152.000</p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[10px] text-white/70">Saldo masuk instan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
