'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';

/**
 * Hero beranda — gaya marketplace modern:
 * banner gradient rounded besar, search pill menonjol,
 * quick chips kategori, dan komposisi kartu melayang yang bersih.
 */
const QUICK_LINKS = [
  { label: 'Pulsa', href: '/katalog?kategori=pulsa', icon: 'call' },
  { label: 'Paket Data', href: '/katalog?cat=data', icon: 'wifi' },
  { label: 'PLN', href: '/katalog?cat=pln', icon: 'bolt' },
  { label: 'Uang Elektronik', href: '/katalog?cat=ewallet', icon: 'wallet' },
] as const;

export const Hero: React.FC = () => {
  const router = useRouter();
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/katalog?q=${encodeURIComponent(query)}` : '/katalog');
  };

  return (
    <section className="border-b border-line bg-surface">
      <div className="shell py-8 lg:py-12">
        {/* ---------- Banner gradient rounded (gaya marketplace) ---------- */}
        <div className="relative overflow-hidden rounded-[28px] bg-accent lg:rounded-[36px]">
          {/* Dekorasi lembut: lingkaran & grid titik */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-90px] left-1/4 h-64 w-64 rounded-full bg-white/[0.07] blur-xl" />
            <div className="absolute top-8 right-[46%] h-24 w-24 rounded-full border-[10px] border-white/10" />
            <div className="absolute bottom-6 left-6 h-16 w-16 rounded-2xl rotate-12 bg-white/5" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            {/* ---------- Kolom kiri ---------- */}
            <div>
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm sm:px-3.5 sm:text-[11px] sm:tracking-[0.14em]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Marketplace Produk Digital #1
              </span>

              <h1 className="mt-4 font-sans font-extrabold text-white text-[28px] leading-[1.12] sm:text-[46px] lg:text-[54px] tracking-[-0.035em]">
                Top up &amp; Bayar Tagihan,
                <br />
                <span className="text-gold">Semua Bisa</span> di Sini.
              </h1>

              <p className="mt-4 text-[15px] text-white/75 leading-relaxed max-w-[44ch]">
                Pulsa, paket data, token PLN, tagihan internet, sampai uang elektronik —
                proses otomatis, cukup scan QRIS.
              </p>

              {/* Search pill besar */}
              <form
                onSubmit={submit}
                className="mt-7 flex items-center gap-1.5 max-w-[540px] rounded-full bg-white p-1.5 shadow-lg shadow-ink/20 focus-within:ring-4 focus-within:ring-white/25 transition-shadow"
              >
                <span className="pl-4 text-muted">
                  <Icon name="search" className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari pulsa, paket data, PLN..."
                  aria-label="Cari produk"
                  className="flex-1 min-w-0 h-12 bg-transparent text-[15px] font-medium text-ink placeholder:text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 px-5 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition-colors cursor-pointer sm:px-6"
                >
                  Cari
                </button>
              </form>

              {/* Quick chips kategori — horizontal scroll di mobile */}
              <div className="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-0.5 -mx-1 px-1">
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 cursor-pointer"
                  >
                    <Icon name={link.icon} className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
              </div>

              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="w-3.5 h-3.5" /> Pembayaran QRIS
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="w-3.5 h-3.5" /> Diproses otomatis
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="w-3.5 h-3.5" /> Tanpa biaya admin
                </span>
              </p>

              {/* Kartu produk ringkas — hanya tampil di mobile/tablet */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 lg:hidden">
                <div className="rounded-2xl bg-white p-3.5 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon name="call" className="w-4.5 h-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-muted">Pulsa 25.000</p>
                      <p className="text-sm font-bold text-ink num-tabular">Rp26.500</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-3.5 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold">
                      <Icon name="bolt" className="w-4.5 h-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-muted">Token PLN</p>
                      <p className="text-sm font-bold text-ink num-tabular">Rp102.500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- Kolom kanan: kartu melayang modern ---------- */}
            <div className="relative hidden h-[400px] lg:block" aria-hidden="true">
              {/* Kartu utama — saldo / uang elektronik */}
              <div className="absolute left-0 top-2 w-[280px] rounded-3xl bg-ink p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">
                    Saldo Uang Elektronik
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white">
                    <Icon name="wallet" className="w-4 h-4" />
                  </span>
                </div>
                <p className="mt-3 font-sans text-[30px] font-extrabold text-white num-tabular tracking-tight">
                  Rp152.000
                </p>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-3.5 py-2.5">
                  <span className="text-xs text-white/70">Top up instan 24/7</span>
                  <span className="text-xs font-bold text-gold">+2.5%</span>
                </div>
              </div>

              {/* Kartu produk — pulsa */}
              <div className="absolute right-0 top-24 w-[240px] rounded-3xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon name="call" className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted">Pulsa 25.000</p>
                    <p className="text-[15px] font-bold text-ink num-tabular">Rp26.500</p>
                  </div>
                </div>
                <div className="mt-3 h-10 rounded-xl bg-gold text-white text-sm font-semibold grid place-items-center">
                  Beli Sekarang
                </div>
              </div>

              {/* Kartu notifikasi sukses */}
              <div className="absolute left-4 bottom-14 w-[260px] rounded-3xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Icon name="check" className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">Top up berhasil!</p>
                    <p className="text-xs text-muted">Token PLN 20.000 terkirim</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full w-full rounded-full bg-accent" />
                </div>
              </div>

              {/* Kartu kecil — paket data */}
              <div className="absolute bottom-0 right-6 w-[190px] rounded-3xl border border-line bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-soft text-gold">
                    <Icon name="wifi" className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted">Paket Data 10GB</p>
                    <p className="text-[15px] font-bold text-ink num-tabular">Rp55.000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
