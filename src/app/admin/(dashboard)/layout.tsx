import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

/**
 * Kerangka panel admin.
 *
 * `proxy.ts` sudah menahan tamu sebelum sampai ke sini, tapi pengecekan di
 * layout ini tetap dilakukan: kalau ada celah di matcher, halaman tetap aman.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/login?redirect=/admin');

  return (
    <AdminShell email={admin.email} fullName={admin.fullName}>
      {children}
    </AdminShell>
  );
}
