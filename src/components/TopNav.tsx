'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wordmark } from './Brand';
import { Icon } from './Icon';
import { BRAND, waLink } from '../lib/config';

interface NavItem {
  label: string;
  /** Kunci hash seksi di beranda (opsional). */
  hash?: string;
  href?: string;
  match: (path: string) => boolean;
}

const NAV: NavItem[] = [
  { label: 'Katalog', hash: 'katalog', match: (p) => p === '/' },
  { label: 'Promo', hash: 'promo', match: () => false },
  { label: 'Panduan', hash: 'cara-transaksi', match: () => false },
  { label: 'Cek Pesanan', href: '/cek-pesanan', match: (p) => p.startsWith('/cek-pesanan') },
];

/**
 * Header dua tingkat: utility bar navy (32px) + header putih sticky dengan
 * search bar di tengah dan tombol WhatsApp CS.
 */
export const TopNav: React.FC = () => {
  const path = usePathname() || '/';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');

  const goHash = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (path === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(`/#${hash}`);
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    setMenuOpen(false);
    router.push(term ? `/?q=${encodeURIComponent(term)}#katalog` : '/#katalog');
  };

  const wa = waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`);

  return (
    <>
      {/* ---------- 1. Utility bar ---------- */}
      <div className="bg-ink text-white/80">
        <div className="shell h-8 flex items-center justify-between text-[12.5px]">
          <span>Layanan Produk Digital</span>
          <nav className="flex items-center gap-5" aria-label="Tautan layanan">
            <a
              href="#cara-transaksi"
              onClick={(e) => goHash(e, 'cara-transaksi')}
              className="hover:text-gold transition-colors hidden sm:inline"
            >
              Panduan Pembayaran
            </a>
            <Link href="/cek-pesanan" className="hover:text-gold transition-colors hidden sm:inline">
              Pelacakan Pesanan
            </Link>
            <Link href="/bantuan" className="hover:text-gold transition-colors">
              Bantuan
            </Link>
          </nav>
        </div>
      </div>

      {/* ---------- 2. Header ---------- */}
      <header className="sticky top-0 z-50 bg-white border-b border-line">
        <div className="shell">
          <div className="flex items-center gap-4 lg:gap-7 py-3 lg:h-[76px] lg:py-0 flex-wrap lg:flex-nowrap">
            <Link href="/" className="shrink-0" aria-label={`${BRAND.name} — beranda`}>
              <Wordmark height={30} />
            </Link>

            <form
              onSubmit={submitSearch}
              className="order-3 lg:order-none basis-full lg:basis-auto lg:flex-1 flex items-center gap-2.5 h-12 pl-3.5 pr-1.5 rounded-xl bg-surface border-[1.5px] border-line focus-within:bg-white focus-within:border-ink transition-colors"
            >
              <Icon name="search" className="w-[18px] h-[18px] text-muted shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari pulsa, paket data, token PLN, e-wallet…"
                aria-label="Cari produk"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-ink placeholder:text-muted"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-ink hover:bg-accent text-white font-bold text-[13.5px] transition-colors cursor-pointer shrink-0"
              >
                Cari
              </button>
            </form>

            {/* Navigasi desktop */}
            <nav className="hidden lg:flex items-center gap-6 shrink-0" aria-label="Navigasi utama">
              {NAV.map((item) => {
                const active = item.match(path);
                const cls = `text-[14.5px] font-semibold transition-colors ${
                  active ? 'text-accent' : 'text-ink hover:text-accent'
                }`;
                return item.hash ? (
                  <a
                    key={item.label}
                    href={`#${item.hash}`}
                    onClick={(e) => goHash(e, item.hash as string)}
                    className={cls}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href as string} className={cls}>
                    {item.label}
                  </Link>
                );
              })}

              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-[42px] px-4 rounded-lg bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors"
              >
                <Icon name="whatsapp" className="w-4 h-4" />
                WhatsApp CS
              </a>
            </nav>

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              className="lg:hidden ml-auto w-[42px] h-[42px] rounded-lg border-[1.5px] border-line bg-white grid place-items-center cursor-pointer"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="w-5 h-5 text-ink" />
            </button>
          </div>

          {/* Menu mobile */}
          {menuOpen && (
            <nav
              className="lg:hidden flex flex-col gap-1 pt-3 pb-4 border-t border-line animate-fade"
              aria-label="Navigasi mobile"
            >
              {[
                { label: 'Katalog', hash: 'katalog' },
                { label: 'Promo', hash: 'promo' },
                { label: 'Panduan', hash: 'cara-transaksi' },
              ].map((m) => (
                <a
                  key={m.hash}
                  href={`#${m.hash}`}
                  onClick={(e) => goHash(e, m.hash)}
                  className="py-2.5 text-sm font-semibold text-ink"
                >
                  {m.label}
                </a>
              ))}
              <Link
                href="/cek-pesanan"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-semibold text-ink"
              >
                Cek Pesanan
              </Link>
              <Link
                href="/bantuan"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-semibold text-ink"
              >
                Bantuan
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 h-[42px] rounded-lg bg-accent hover:bg-accent-dark text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Icon name="whatsapp" className="w-4 h-4" />
                WhatsApp CS
              </a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};