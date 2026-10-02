'use client';

import React from 'react';
import { ServiceId } from '../types';

interface Props {
  /** Tombol CTA sekunder -> scroll ke katalog. */
  onBrowse: () => void;
  /** Tombol CTA utama -> buka halaman `/checkout` untuk layanan tertentu. */
  onGo: (service?: ServiceId, providerId?: string) => void;
}

/** Mosaik promo: 1 kartu besar (hijau) + 2 kartu kecil (amber & midnight). */
export const PromoMosaic: React.FC<Props> = ({ onBrowse, onGo }) => (
  <section className="shell pt-4 pb-14" id="promo">
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4">
      {/* Kartu besar */}
      <article className="lg:row-span-2 rounded-2xl bg-accent text-white p-8 flex flex-col justify-end items-start gap-3 min-h-[330px]">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] px-2.5 py-1.5 rounded-full bg-white/20">
          Harian
        </span>
        <h3 className="text-2xl sm:text-[26px] font-extrabold tracking-tight">
          Pulsa &amp; Paket Data
        </h3>
        <p className="text-sm text-white/85 max-w-[32ch]">
          Pilihan layanan untuk kebutuhan harian.
        </p>
        <button
          type="button"
          onClick={() => onGo('pulsa')}
          className="mt-2 h-11 px-5 rounded-xl bg-white text-accent font-bold text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
        >
          Beli Pulsa
        </button>
        <button
          type="button"
          onClick={onBrowse}
          className="h-11 px-4 rounded-xl border-[1.5px] border-white/45 text-white font-bold text-sm hover:bg-white hover:text-accent transition-colors cursor-pointer"
        >
          Jelajahi Katalog
        </button>
      </article>

      {/* Kartu kecil 1 — kuning */}
      <article className="rounded-2xl bg-gold p-8 flex flex-col items-start gap-3">
        <h3 className="text-[26px] font-extrabold tracking-tight text-ink">Token PLN</h3>
        <p className="text-sm text-[#7a5a00] max-w-[32ch]">Isi token listrik sesuai kebutuhan.</p>
        <button
          type="button"
          onClick={() => onGo('pln', 'pln-prabayar')}
          className="mt-2 h-11 px-5 rounded-xl bg-ink text-white font-bold text-sm hover:bg-ink-soft transition-colors cursor-pointer"
        >
          Beli Token
        </button>
      </article>

      {/* Kartu kecil 2 — navy */}
      <article className="rounded-2xl bg-ink p-8 flex flex-col items-start gap-3">
        <h3 className="text-[26px] font-extrabold tracking-tight text-white">Bayar Tagihan</h3>
        <p className="text-sm text-white/75 max-w-[32ch]">
          Kelola kebutuhan pembayaran rutin.
        </p>
        <button
          type="button"
          onClick={() => onGo('tagihan')}
          className="mt-2 h-11 px-5 rounded-xl bg-gold text-ink font-bold text-sm hover:bg-white transition-colors cursor-pointer"
        >
          Bayar Tagihan
        </button>
      </article>
    </div>
  </section>
);