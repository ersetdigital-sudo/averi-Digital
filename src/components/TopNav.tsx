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
  { label: 'Home', href: '/', match: (p) => p === '/' },
  { label: 'Katalog', href: '/katalog', match: (p) => p.startsWith('/katalog') },
  { label: 'Promo', href: '/promo', match: (p) => p.startsWith('/promo') },
  { label: 'FAQ', href: '/faq', match: (p) => p.startsWith('/faq') },
  { label: 'Cek Pesanan', href: '/cek-pesanan', match: (p) => p.startsWith('/cek-pesanan') },
];

/**
 * Header dua tingkat: utility bar (32px) + header putih sticky.
 * Desktop: logo di kiri, navigasi **rata tengah**, tombol WhatsApp CS di kanan.
 */
export const TopNav: React.FC = () => {
  const path = usePathname() || '/';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const goHash = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (path === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(`/#${hash}`);
    }
  };

  const wa = waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`);

  return (
    <>
      {/* ---------- 1. Utility bar ---------- */}
      <div className="bg-ink text-white/80">
        <div className="shell h-8 flex items-center justify-between text-[12.5px]">
          <span>Layanan Produk Digital</span>
          <nav className="flex items-center gap-5" aria-label="Tautan layanan">
            <Link
              href="/panduan-pembayaran"
              className="hover:text-gold transition-colors hidden sm:inline"
            >
              Panduan Pembayaran
            </Link>
            <Link href="/cek-pesanan" className="hover:text-gold transition-colors hidden sm:inline">
              Pelacakan Pesanan
            </Link>
            <Link href="/hubungi-kami" className="hover:text-gold transition-colors">
              Hubungi Kami
            </Link>
          </nav>
        </div>
      </div>

      {/* ---------- 2. Header ---------- */}
      <header className="sticky top-0 z-50 bg-white border-b border-line">
        <div className="shell">
          {/* Mobile: logo + burger. Desktop: grid 3 kolom agar nav rata tengah. */}
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 lg:h-[76px] lg:py-0">
            <Link href="/" className="justify-self-start" aria-label={`${BRAND.name} — beranda`}>
              <Wordmark height={30} />
            </Link>

            {/* Navigasi desktop — rata tengah */}
            <nav className="hidden lg:flex items-center gap-7 justify-self-center" aria-label="Navigasi utama">
              {NAV.map((item) => {
                const active = item.match(path);
                const cls = `relative text-[14.5px] font-semibold transition-colors py-1 ${
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
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                    )}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href as string} className={cls}>
                    {item.label}
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Tombol WhatsApp CS — rata kanan (desktop) */}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 h-[42px] px-4 rounded-lg bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors justify-self-end"
            >
              <Icon name="whatsapp" className="w-4 h-4" />
              WhatsApp CS
            </a>

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              className="lg:hidden justify-self-end w-[42px] h-[42px] rounded-lg border-[1.5px] border-line bg-white grid place-items-center cursor-pointer"
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
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-semibold text-ink"
              >
                Home
              </Link>
              {[
                { label: 'Katalog', href: '/katalog' },
                { label: 'Promo', href: '/promo' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Cek Pesanan', href: '/cek-pesanan' },
                { label: 'Hubungi Kami', href: '/hubungi-kami' },
              ].map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm font-semibold text-ink"
                >
                  {m.label}
                </Link>
              ))}
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