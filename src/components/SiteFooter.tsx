'use client';

import React from 'react';
import Link from 'next/link';
import { Wordmark } from './Brand';
import { Icon } from './Icon';
import { BRAND, waLink } from '../lib/config';
import type { CategoryMeta } from '../types';

/** Footer 4 kolom dengan latar navy. Daftar Layanan dibaca dari tabel `categories`. */
export const SiteFooter: React.FC<{ categories: CategoryMeta[] }> = ({ categories }) => (
  <footer className="bg-ink text-white/75">
    <div className="shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 pt-12 pb-10">
      {/* Brand */}
      <div className="lg:col-span-1">
        <Wordmark height={30} light />
        <p className="mt-3.5 text-sm max-w-[34ch] leading-relaxed">
          {BRAND.tagline} Marketplace produk digital dan pembayaran tagihan untuk kebutuhan
          harian.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/70">
          <Icon name="shield" className="w-4 h-4 text-gold shrink-0" />
          <span>Pembayaran QRIS · Enkripsi 256-bit</span>
        </div>
      </div>

      {/* Layanan */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white mb-1.5">
          Layanan
        </h4>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/katalog?cat=${c.id}`}
            className="text-sm hover:text-gold transition-colors w-fit"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Bantuan */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white mb-1.5">
          Bantuan
        </h4>
        <Link href="/cek-pesanan" className="text-sm hover:text-gold transition-colors w-fit">
          Cek Pesanan
        </Link>
        <Link href="/panduan-pembayaran" className="text-sm hover:text-gold transition-colors w-fit">
          Panduan Pembayaran
        </Link>
        <Link href="/faq" className="text-sm hover:text-gold transition-colors w-fit">
          FAQ
        </Link>
        <Link href="/hubungi-kami" className="text-sm hover:text-gold transition-colors w-fit">
          Hubungi Kami
        </Link>
        <a
          href={waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:text-gold transition-colors w-fit"
        >
          WhatsApp CS · {BRAND.csHours}
        </a>
      </div>

      {/* Informasi */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white mb-1.5">
          Informasi
        </h4>
        <Link href="/syarat-ketentuan" className="text-sm hover:text-gold transition-colors w-fit">
          Syarat &amp; Ketentuan
        </Link>
        <Link href="/kebijakan-privasi" className="text-sm hover:text-gold transition-colors w-fit">
          Kebijakan Privasi
        </Link>
      </div>
    </div>

    <div className="border-t border-white/15">
      <div className="shell py-4 text-[13px]">© 2026 {BRAND.name}. Seluruh hak cipta dilindungi.</div>
    </div>
  </footer>
);