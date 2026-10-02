'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, IconName } from '../components/Icon';

interface Promo {
  icon: IconName;
  tone: 'accent' | 'gold' | 'ink';
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}

const PROMOS: Promo[] = [
  {
    icon: 'call',
    tone: 'accent',
    eyebrow: 'Promo Harian',
    title: 'Pulsa 25.000 cuma Rp26.500',
    body: 'Isi ulang pulsa Telkomsel, Indosat, XL, Tri, dan Smartfren tanpa biaya admin.',
    cta: 'Beli Pulsa',
    href: '/katalog?cat=pulsa',
  },
  {
    icon: 'bolt',
    tone: 'gold',
    eyebrow: 'Token PLN',
    title: 'Harga bersih, token instan',
    body: 'Token listrik 20 digit terkirim otomatis setelah pembayaran QRIS terkonfirmasi.',
    cta: 'Beli Token',
    href: '/katalog?cat=pln',
  },
  {
    icon: 'wifi',
    tone: 'ink',
    eyebrow: 'Kuota Tancap',
    title: 'Paket data 30 GB hemat',
    body: 'Kuota utama 24 jam untuk streaming dan belajar. Berlaku 30 hari penuh.',
    cta: 'Lihat Paket Data',
    href: '/katalog?cat=data',
  },
  {
    icon: 'receipt',
    tone: 'ink',
    eyebrow: 'Tagihan Rutin',
    title: 'Bayar BPJS & cicilan sekali klik',
    body: 'Iuran BPJS, angsuran multifinance, PDAM, dan pembayaran internet dalam satu tempat.',
    cta: 'Ke Katalog',
    href: '/katalog',
  },
];

const TONE: Record<Promo['tone'], string> = {
  accent: 'bg-accent text-white',
  gold: 'bg-gold text-white',
  ink: 'bg-ink text-white',
};

/** Halaman /promo — kartu promosi geometris. */
export const PromoPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
        Penawaran
      </span>
      <h1 className="mt-2 text-3xl sm:text-[38px] font-extrabold tracking-[-0.035em] text-ink">
        Promo Berjalan
      </h1>
      <p className="mt-2 text-sm text-muted">
        Harga bersih tanpa biaya admin — berlaku setiap hari.
      </p>
    </div>

    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PROMOS.map((p) => (
        <article
          key={p.title}
          className={`${TONE[p.tone]} rounded-3xl p-7 flex flex-col items-start gap-3 min-h-[240px] relative overflow-hidden`}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" aria-hidden="true" />
          <span className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center">
            <Icon name={p.icon} className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">
            {p.eyebrow}
          </span>
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] leading-snug">
            {p.title}
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-[40ch]">{p.body}</p>
          <Link
            href={p.href}
            className="mt-auto h-11 inline-flex items-center px-5 rounded-xl bg-white text-ink font-semibold text-sm hover:bg-gold hover:text-white transition-colors"
          >
            {p.cta}
            <Icon name="arrow_right" className="w-4 h-4 ml-1.5" />
          </Link>
        </article>
      ))}
    </div>
  </div>
);
