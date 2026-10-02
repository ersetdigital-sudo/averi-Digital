import type { Metadata } from 'next';
import { ADMIN_BRAND } from '@/components/admin/AdminBrand';

/**
 * Layout area admin (semua route di bawah `/admin`).
 *
 * Kerangkanya sengaja minimal: tidak ada navbar, footer, maupun tautan
 * storefront. Halaman di dalamnya menyusun tampilannya sendiri —
 * `login/` punya layar autentikasi sendiri, dan `(dashboard)/` punya sidebar.
 *
 * Metadata di sini juga menimpa metadata storefront di layout akar supaya
 * teks brand pelanggan tidak ikut bocor ke HTML halaman admin (mis. lewat
 * `<meta name="description">`).
 */
const ADMIN_DESCRIPTION = `Area administrasi ${ADMIN_BRAND.name} — kelola produk, pesanan, dan pengaturan toko.`;

export const metadata: Metadata = {
  title: ADMIN_BRAND.title,
  description: ADMIN_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: ADMIN_BRAND.title,
    description: ADMIN_DESCRIPTION,
    type: 'website',
  },
  twitter: { card: 'summary' },
};

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full">{children}</div>;
}
