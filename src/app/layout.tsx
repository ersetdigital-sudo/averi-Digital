import type { Metadata, Viewport } from 'next';
import '../index.css';
import { TopNav } from '../components/TopNav';
import { SiteFooter } from '../components/SiteFooter';
import { BRAND } from '../lib/config';

// Aplikasi ini sepenuhnya interaktif di sisi klien (state wizard, localStorage,
// dan query URL), sehingga dirender on-demand. Ini juga membuat `useSearchParams()`
// pada komponen klien bekerja tanpa boundary Suspense tambahan.
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
      <body className="bg-page text-ink min-h-screen flex flex-col antialiased">
        {/* React 19 mengangkat <link> ini ke <head> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />

        <TopNav />
        <main className="flex-1 w-full">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}