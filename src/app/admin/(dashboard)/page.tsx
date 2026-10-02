import { DashboardView } from '@/components/admin/dashboard/DashboardView';
import { fetchAllOrders, fetchDashboardStats, fetchRevenueSeries } from '@/app/actions/orders';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard · Panel Admin Averi Digital' };

/** Semua angka berasal dari Supabase — tidak ada data contoh di halaman ini. */
export default async function Page() {
  const [stats, orders, series] = await Promise.all([
    fetchDashboardStats(),
    fetchAllOrders(),
    fetchRevenueSeries(7),
  ]);

  return <DashboardView stats={stats} orders={orders} series={series} />;
}
