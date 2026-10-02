'use client';

import React, { useMemo, useState } from 'react';
import { ServiceId, Nominal } from '../types';
import { SERVICES, SERVICE_META, NOMINALS } from '../data/catalog';
import { Icon } from './Icon';
import { rupiah } from '../lib/config';

interface HeroProps {
  /** Chip populer / hasil pencarian dipilih -> isi wizard & lompat ke langkah nomor tujuan. */
  onQuickPick: (service: ServiceId, nominalId: string) => void;
  /** Tombol "Lihat Katalog" -> kembali ke langkah 1 (pilih layanan). */
  onBrowse: () => void;
}

/** Chip populer — id nominal harus ada di `NOMINALS`. */
const POPULAR: { label: string; service: ServiceId; nominalId: string }[] = [
  { label: 'Pulsa 25rb', service: 'pulsa', nominalId: 'p25' },
  { label: 'Token PLN 100rb', service: 'pln', nominalId: 'pln100' },
  { label: 'E-Wallet 50rb', service: 'ewallet', nominalId: 'ew50' },
  { label: 'Paket Data 10GB', service: 'data', nominalId: 'd10' },
];

interface Hit {
  service: ServiceId;
  nominal: Nominal;
  serviceName: string;
}

/** Indeks pencarian datar: semua layanan x semua nominal. */
const INDEX: Hit[] = SERVICES.flatMap(({ id }) =>
  NOMINALS[id].map((nominal) => ({
    service: id,
    nominal,
    serviceName: SERVICE_META[id].name,
  }))
);

export const Hero: React.FC<HeroProps> = ({ onQuickPick, onBrowse }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const hits = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return INDEX.filter(
      (h) =>
        h.serviceName.toLowerCase().includes(query) ||
        SERVICE_META[h.service].short.toLowerCase().includes(query) ||
        SERVICE_META[h.service].blurb.toLowerCase().includes(query) ||
        h.nominal.label.toLowerCase().includes(query) ||
        h.nominal.note.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hits.length > 0) {
      onQuickPick(hits[0].service, hits[0].nominal.id);
      setQ('');
      setOpen(false);
    } else {
      onBrowse();
    }
  };

  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* ---------- Kiri: teks + pencarian ---------- */}
        <div className="lg:col-span-7">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
            Transaksi Cepat
          </span>

          <h1 className="mt-3 text-[34px] leading-[1.08] sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] text-ink">
            Apa yang Kamu
            <br />
            Butuhkan Hari Ini?
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ink-soft leading-relaxed max-w-lg">
            Cari produk, pilih nominal, lalu lanjutkan pembayaran.
          </p>

          {/* Search bar */}
          <form onSubmit={submit} className="mt-6 relative max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
              <Icon name="search" className="w-5 h-5 text-muted ml-3 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 160)}
                placeholder="Cari produk atau nominal…"
                className="flex-1 min-w-0 h-11 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                aria-label="Cari produk atau nominal"
              />
              <button
                type="submit"
                className="hidden sm:inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors cursor-pointer shrink-0"
              >
                Cari Produk
              </button>
            </div>

            {/* Hasil pencarian */}
            {open && hits.length > 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-line bg-white shadow-lg overflow-hidden animate-fade">
                {hits.map((h) => (
                  <button
                    key={`${h.service}-${h.nominal.id}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onQuickPick(h.service, h.nominal.id);
                      setQ('');
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface transition-colors cursor-pointer border-b border-line last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink">
                        {SERVICE_META[h.service].short} · {h.nominal.label}
                      </span>
                      <span className="block text-[11px] text-muted truncate">{h.nominal.note}</span>
                    </span>
                    <span className="text-sm font-bold text-accent num-tabular shrink-0">
                      {rupiah(h.nominal.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Chip populer */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted mr-1">
              Populer
            </span>
            {POPULAR.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onQuickPick(p.service, p.nominalId)}
                className="h-9 px-3.5 rounded-full border-[1.5px] border-line bg-white text-xs font-bold text-ink-soft hover:border-ink hover:text-ink transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Kanan: kartu gelap ---------- */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl bg-ink text-white p-7 sm:p-8 shadow-xl">
            {/* Garis dekoratif atas */}
            <div className="absolute top-0 left-0 right-0 h-2 flex" aria-hidden="true">
              <span className="w-[45%] bg-accent" />
              <span className="w-[27%] bg-gold" />
              <span className="flex-1 bg-white" />
            </div>

            {/* Bentuk dekoratif sudut kanan bawah */}
            <div className="pointer-events-none absolute -bottom-6 -right-6" aria-hidden="true">
              <span className="absolute bottom-8 right-14 w-14 h-14 rounded-2xl bg-gold rotate-12" />
              <span className="absolute bottom-1 right-1 w-20 h-20 rounded-2xl bg-accent/90 -rotate-6" />
            </div>

            <div className="relative">
              <span className="inline-flex items-center h-7 px-3 rounded-full bg-gold text-ink text-[10px] font-extrabold uppercase tracking-wider">
                Katalog Lengkap
              </span>

              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                Kebutuhan Digital,
                <br />
                Tinggal Pilih.
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-white/75 leading-relaxed max-w-xs">
                Pulsa, paket data, token listrik, e-wallet, dan pembayaran tagihan.
              </p>

              <button
                type="button"
                onClick={onBrowse}
                className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gold text-ink font-bold text-sm hover:bg-white transition-colors cursor-pointer"
              >
                <Icon name="bolt" className="w-4 h-4 text-accent" />
                Lihat Katalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};