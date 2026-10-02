'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

/**
 * Mosaik promo — blok geometris teal/merah/ink.
 * Tautan langsung ke katalog (tanpa state wizard).
 */
export const PromoMosaic: React.FC = () => (
  <section className="shell pt-4 pb-14" id="promo">
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4">
      {/* Kartu besar — teal */}
      <article className="lg:row-span-2 rounded-3xl bg-accent text-white p-8 flex flex-col justify-end items-start gap-3 min-h-[330px] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" aria-hidden="true" />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-gold text-white">
          Harian
        </span>
        <h3 className="text-2xl sm:text-[28px] font-extrabold tracking-[-0.03em]">
          Pulsa &amp; Paket Data
        </h3>
        <p className="text-sm text-white/85 max-w-[32ch]">
          Isi ulang kapan saja, harga bersih tanpa biaya admin.
        </p>
        <div className="mt-2 flex flex-wrap gap-2.5">
          <Link
            href="/katalog?cat=pulsa"
            className="h-11 inline-flex items-center px-5 rounded-xl bg-white text-accent font-semibold text-sm hover:bg-gold hover:text-white transition-colors"
          >
            Beli Pulsa
          </Link>
          <Link
            href="/katalog?cat=data"
            className="h-11 inline-flex items-center px-4 rounded-xl border-[1.5px] border-white/45 text-white font-semibold text-sm hover:bg-white hover:text-accent transition-colors"
          >
            Paket Data
            <Icon name="arrow_right" className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </article>

      {/* Kartu kecil — merah */}
      <article className="rounded-3xl bg-gold text-white p-8 flex flex-col items-start gap-3">
        <h3 className="text-[26px] font-extrabold tracking-[-0.03em]">Token PLN</h3>
        <p className="text-sm text-white/85 max-w-[32ch]">
          Token listrik 20 digit langsung terkirim.
        </p>
        <Link
          href="/katalog?cat=pln"
          className="mt-2 h-11 inline-flex items-center px-5 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-ink-soft transition-colors"
        >
          Beli Token
        </Link>
      </article>

      {/* Kartu kecil — ink */}
      <article className="rounded-3xl bg-ink text-white p-8 flex flex-col items-start gap-3">
        <h3 className="text-[26px] font-extrabold tracking-[-0.03em]">Pembayaran Internet</h3>
        <p className="text-sm text-white/75 max-w-[32ch]">
          Tagihan bulanan rumah, bayar sekali klik.
        </p>
        <Link
          href="/katalog?cat=internet"
          className="mt-2 h-11 inline-flex items-center px-5 rounded-xl bg-gold text-white font-semibold text-sm hover:bg-gold-dark transition-colors"
        >
          Bayar Tagihan
        </Link>
      </article>
    </div>
  </section>
);
