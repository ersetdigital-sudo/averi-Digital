import type { Metadata } from 'next';
import { ADMIN_BRAND } from '@/components/admin/AdminBrand';

/**
 * Layout autentikasi admin.
 *
 * Layar penuh, berdiri sendiri: TIDAK merender navbar, footer, maupun tautan
 * storefront apa pun. Komponen publik hanya hidup di `src/app/(public)/`,
 * jadi di sini dijamin tidak ada elemen customer-facing.
 */
export const metadata: Metadata = {
  title: `Masuk ${ADMIN_BRAND.title}`,
  robots: { index: false, follow: false },
};

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#F7F6F2] px-4 py-8 sm:px-6 sm:py-12">
      {/* Dekorasi lembut — tidak menangkap klik dan tidak menambah lebar. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#F2352B]/[0.07] blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[380px] w-[380px] rounded-full bg-[#111827]/[0.05] blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">{children}</div>
    </div>
  );
}
