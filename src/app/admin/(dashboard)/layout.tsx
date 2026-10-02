import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { Mark } from '@/components/Brand';

export const dynamic = 'force-dynamic';

/**
 * Kerangka panel admin.
 *
 * `proxy.ts` sudah menahan tamu sebelum sampai ke sini, tapi pengecekan di
 * layout ini tetap dilakukan: kalau ada celah di matcher, halaman tetap aman.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/login?redirect=/admin/verifikasi');

  return (
    <div className="shell py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[236px_1fr] lg:items-start">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-line bg-white p-4 lg:sticky lg:top-6">
          <div className="flex items-center gap-2.5 px-1 pb-4 mb-3 border-b border-line">
            <Mark height={30} />
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                Panel Admin
              </p>
              <p className="truncate text-[11px] text-muted">{admin.email}</p>
            </div>
          </div>

          <AdminNav />

          <div className="mt-4 border-t border-line pt-2">
            <LogoutButton className="w-full" />
          </div>
        </aside>

        {/* Isi halaman */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
