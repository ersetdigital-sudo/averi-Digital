import Link from 'next/link';
import { fetchDashboardStats, fetchAllOrders } from '@/app/actions/orders';
import { rupiah } from '@/lib/config';
import { Icon, type IconName } from '@/components/Icon';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard · Panel Admin Averi Digital' };

/** Kartu angka ringkas. */
const Stat: React.FC<{
  label: string;
  value: string;
  icon: IconName;
  tone?: 'default' | 'accent' | 'warn';
}> = ({ label, value, icon, tone = 'default' }) => (
  <div className="rounded-2xl border border-line bg-white p-4">
    <div className="flex items-center gap-2">
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg ${
          tone === 'accent'
            ? 'bg-accent-soft text-accent'
            : tone === 'warn'
              ? 'bg-gold-soft text-gold'
              : 'bg-surface text-ink-soft'
        }`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</span>
    </div>
    <p className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-ink num-tabular">{value}</p>
  </div>
);

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  WAITING_VERIFICATION: 'Menunggu Verifikasi',
  VERIFIED: 'Terverifikasi',
  PROCESSING: 'Diproses',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
};

export default async function Page() {
  const [stats, orders] = await Promise.all([fetchDashboardStats(), fetchAllOrders()]);
  const s = stats ?? {};
  const n = (key: string) => Number(s[key] ?? 0);

  const recent = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Ringkasan katalog */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">Katalog</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Total Produk" value={String(n('products_total'))} icon="price_check" tone="accent" />
          <Stat label="Produk Aktif" value={String(n('products_active'))} icon="verified_user" />
          <Stat label="Total Kategori" value={String(n('categories_total'))} icon="book" tone="accent" />
          <Stat label="Kategori Aktif" value={String(n('categories_active'))} icon="check_circle" />
        </div>
      </section>

      {/* Ringkasan pesanan */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">Pesanan</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Hari Ini" value={String(n('orders_today'))} icon="clock" />
          <Stat label="Pending" value={String(n('orders_pending'))} icon="alert" tone="warn" />
          <Stat label="Selesai" value={String(n('orders_success'))} icon="check_circle" tone="accent" />
          <Stat label="Total Pesanan" value={String(n('orders_total'))} icon="receipt_long" />
        </div>
      </section>

      {/* Pendapatan */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-ink p-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
            Pendapatan Hari Ini
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] num-tabular">
            {rupiah(n('revenue_today'))}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Total Pendapatan (Berhasil)
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-ink num-tabular">
            {rupiah(n('revenue_total'))}
          </p>
        </div>
      </section>

      {/* Pesanan terbaru */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Pesanan Terbaru
          </h2>
          <Link href="/admin/pesanan" className="text-xs font-semibold text-accent hover:underline">
            Kelola pesanan
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {recent.length === 0 ? (
            <p className="p-6 text-center text-xs text-muted">Belum ada pesanan.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink num-tabular">{order.invoice}</p>
                    <p className="truncate text-[11px] text-muted">
                      {order.serviceName} · {order.destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-ink num-tabular">
                      {rupiah(order.total)}
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Aksi cepat */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/admin/produk"
          className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-accent"
        >
          <Icon name="price_check" className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-ink">Kelola Produk</span>
        </Link>
        <Link
          href="/admin/kategori"
          className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-accent"
        >
          <Icon name="book" className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-ink">Kelola Kategori</span>
        </Link>
        <Link
          href="/admin/pengaturan"
          className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-accent"
        >
          <Icon name="settings" className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-ink">Pengaturan Toko</span>
        </Link>
      </section>
    </div>
  );
}
