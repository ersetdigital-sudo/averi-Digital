import type { Metadata, Viewport } from 'next';
import { Sora } from 'next/font/google';
import '../index.css';
import { BRAND } from '../lib/config';

/**
 * Layout akar — HANYA kerangka dokumen (html/body, font, metadata).
 *
 * Navbar & footer storefront sengaja TIDAK dirender di sini: kalau ditaruh di
 * akar, semua route termasuk panel admin ikut membawanya. Keduanya sekarang
 * tinggal di `src/app/(public)/layout.tsx`, sehingga halaman admin benar-benar
 * tidak merender komponen publik apa pun.
 */

/** Font utama situs: Sora — WAJIB, jangan diganti font lain. */
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

// Aplikasi ini sepenuhnya interaktif di sisi klien (state wizard, query URL),
// sehingga dirender on-demand. Ini juga membuat `useSearchParams()` pada
// komponen klien bekerja tanpa boundary Suspense tambahan.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${BRAND.name} · Isi Ulang & Bayar Tagihan Sekali Klik`,
  description:
    `${BRAND.name} — isi ulang pulsa, paket data, token listrik PLN, saldo e-wallet, dan pembayaran tagihan rutin. Bayar praktis dengan QRIS dalam empat langkah.`,
  openGraph: {
    title: `${BRAND.name} · Isi Ulang & Bayar Tagihan Sekali Klik`,
    description:
      `${BRAND.name} — isi ulang pulsa, paket data, token listrik PLN, saldo e-wallet, dan pembayaran tagihan rutin dengan QRIS.`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Wajib agar env(safe-area-inset-*) aktif di iOS
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className={`${sora.variable} bg-page text-ink min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
