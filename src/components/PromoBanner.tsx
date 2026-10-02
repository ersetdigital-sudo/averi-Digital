'use client';

import React from 'react';
import Link from 'next/link';

/** Banner promo cashback (gambar statis di /public/promo-cashback.png). */
export const PromoBanner: React.FC = () => (
  <section className="shell">
    <Link
      href="/promo"
      className="block rounded-2xl overflow-hidden border border-line bg-white hover:opacity-95 transition-opacity"
      aria-label="Promo Spesial — Cashback hingga 30%"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/promo-cashback.png"
        alt="Promo Spesial — Cashback hingga 30% untuk transaksi pulsa, paket data, PLN, e-wallet, dan pembayaran lainnya"
        className="w-full h-auto block"
      />
    </Link>
  </section>
);
