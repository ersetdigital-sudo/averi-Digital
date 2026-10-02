import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';

/**
 * Layout storefront (publik).
 *
 * Satu-satunya tempat navbar & footer Averi Digital dirender. Semua halaman
 * pelanggan tinggal di dalam route group `(public)`, dan halaman admin berada
 * di luar grup ini sehingga tidak pernah ikut membawa elemen customer-facing.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="w-full flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
