'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND, waLink } from '../lib/config';
import { Icon } from './Icon';

/** Band bantuan: latar navy dengan garis aksen kuning di kiri. */
export const SupportBand: React.FC = () => (
  <section className="shell py-14" id="bantuan">
    <div className="rounded-2xl bg-ink text-white p-8 sm:px-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7 border-l-8 border-gold">
      <div>
        <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight">Butuh Bantuan?</h2>
        <p className="text-sm text-white/75 mt-2 max-w-[52ch] leading-relaxed">
          Periksa status pesanan atau hubungi tim kami jika mengalami kendala.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
        <Link
          href="/cek-pesanan"
          className="h-11 px-5 rounded-xl bg-gold text-ink font-bold text-sm inline-flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          <Icon name="search" className="w-4 h-4" />
          Cek Pesanan
        </Link>
        <a
          href={waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-5 rounded-xl border-[1.5px] border-white/40 text-white font-bold text-sm inline-flex items-center justify-center gap-2 hover:border-gold hover:text-gold transition-colors"
        >
          <Icon name="whatsapp" className="w-4 h-4" />
          WhatsApp CS
        </a>
      </div>
    </div>
  </section>
);