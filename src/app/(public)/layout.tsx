import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { getCategories } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

/**
 * Layout storefront (publik).
 *
 * Satu-satunya tempat navbar & footer Averi Digital dirender. Semua halaman
 * pelanggan tinggal di dalam route group `(public)`, dan halaman admin berada
 * di luar grup ini sehingga tidak pernah ikut membawa elemen customer-facing.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Footer menampilkan daftar kategori dari database (bukan hardcode).
  const categories = await getCategories(true);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="w-full flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </div>
  );
}
