import React from 'react';
import Link from 'next/link';
import type { Order } from '../../../types';
import type { RevenuePoint } from '../../../app/actions/orders';
import { rupiah } from '../../../lib/config';
import { Icon } from '../../Icon';
import { CARD, CARD_PAD, NUM } from './styles';
import { SectionHeader } from './SectionHeader';
import { MetricCard } from './MetricCard';
import { EmptyState } from './EmptyState';
import { OrderTable } from './OrderTable';
import { QuickAction } from './QuickAction';
import { RevenueChart } from './RevenueChart';

interface DashboardViewProps {
  /** `null` = statistik gagal dimuat dari Supabase. */
  stats: Record<string, number> | null;
  orders: Order[];
  series: RevenuePoint[];
}

const RECENT_LIMIT = 6;

/** Error state ringkas — hanya muncul kalau backend gagal. */
const ErrorNotice: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    className="flex flex-wrap items-center gap-3 rounded-2xl border border-gold/25 bg-gold-soft/50 px-4 py-3"
  >
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-gold">
      <Icon name="alert" className="h-4 w-4" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-ink">{message}</p>
      <p className="text-xs text-ink-soft">Periksa koneksi Supabase, lalu muat ulang halaman.</p>
    </div>
    <Link
      href="/admin"
      className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-xl border border-line bg-white px-4 text-xs font-bold text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <Icon name="refresh" className="h-3.5 w-3.5" />
      Muat Ulang
    </Link>
  </div>
);

/** Isi halaman Dashboard — murni presentasional agar bisa diuji tanpa sesi. */
export const DashboardView: React.FC<DashboardViewProps> = ({ stats, orders, series }) => {
  const n = (key: string) => Number(stats?.[key] ?? 0);

  const productsTotal = n('products_total');
  const productsActive = n('products_active');
  const categoriesTotal = n('categories_total');
  const categoriesActive = n('categories_active');

  const ordersToday = n('orders_today');
  const ordersPending = n('orders_pending');
  const ordersWaiting = n('orders_waiting_verification');
  const ordersSuccess = n('orders_success');
  const ordersTotal = n('orders_total');

  const hasSeriesData = series.some((point) => point.orders > 0);

  return (
    <div className="space-y-8">
      {stats === null && <ErrorNotice message="Gagal memuat data dashboard." />}

      <SectionHeader
        variant="page"
        title="Dashboard"
        description="Ringkasan aktivitas toko hari ini."
      />

      {/* Metrik utama — katalog */}
      <section className="space-y-4">
        <SectionHeader title="Katalog" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Total Produk"
            value={String(productsTotal)}
            icon="price_check"
            tone="accent"
            hint={`${productsActive} aktif`}
          />
          <MetricCard
            label="Produk Aktif"
            value={String(productsActive)}
            icon="verified_user"
            tone="success"
            hint={`${Math.max(0, productsTotal - productsActive)} nonaktif`}
          />
          <MetricCard
            label="Total Kategori"
            value={String(categoriesTotal)}
            icon="book"
            tone="accent"
            hint={`${categoriesActive} aktif`}
          />
          <MetricCard
            label="Kategori Aktif"
            value={String(categoriesActive)}
            icon="check"
            tone="success"
            hint={`${Math.max(0, categoriesTotal - categoriesActive)} nonaktif`}
          />
        </div>

        {/* Metrik sekunder — pesanan */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard variant="secondary" label="Pesanan Hari Ini" value={String(ordersToday)} icon="clock" />
          <MetricCard
            variant="secondary"
            label="Pesanan Pending"
            value={String(ordersPending)}
            icon="alert"
            tone="warning"
            hint={`${ordersWaiting} menunggu verifikasi`}
          />
          <MetricCard
            variant="secondary"
            label="Pesanan Selesai"
            value={String(ordersSuccess)}
            icon="check_circle"
            tone="success"
          />
          <MetricCard variant="secondary" label="Total Pesanan" value={String(ordersTotal)} icon="receipt_long" />
        </div>
      </section>

      {/* Pendapatan */}
      <section className="space-y-4">
        <SectionHeader title="Pendapatan" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className={`${CARD} bg-ink ${CARD_PAD} text-white`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
              Total Pendapatan Berhasil
            </p>
            <p className={`mt-3 text-[30px] font-extrabold leading-none ${NUM}`}>
              {rupiah(n('revenue_total'))}
            </p>
            <p className="mt-2 text-xs text-white/60">
              Dari {ordersSuccess} pesanan berhasil
            </p>

            <div className="mt-6 border-t border-white/15 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                Pendapatan Hari Ini
              </p>
              <p className={`mt-1.5 text-xl font-extrabold ${NUM}`}>{rupiah(n('revenue_today'))}</p>
            </div>
          </div>

          <div className={`${CARD} ${CARD_PAD}`}>
            {hasSeriesData ? (
              <RevenueChart points={series} />
            ) : (
              <EmptyState
                icon="spark"
                title="Belum ada data pendapatan"
                description="Grafik akan muncul otomatis setelah pesanan berhasil masuk."
              />
            )}
          </div>
        </div>
      </section>

      {/* Pesanan terbaru */}
      <section className="space-y-4">
        <SectionHeader
          title="Pesanan Terbaru"
          action={
            <Link
              href="/admin/pesanan"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-line/70 bg-white px-4 text-xs font-bold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Kelola Pesanan
              <Icon name="arrow_right" className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className={`${CARD} overflow-hidden`}>
          {orders.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon="receipt_long"
                title="Belum ada pesanan"
                description="Pesanan dari storefront akan tampil di sini begitu pelanggan mulai bertransaksi."
              />
            </div>
          ) : (
            <>
              <OrderTable orders={orders.slice(0, RECENT_LIMIT)} />
              {orders.length > RECENT_LIMIT && (
                <div className="border-t border-line/70 px-5 py-3 text-center">
                  <Link
                    href="/admin/pesanan"
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Lihat semua {orders.length} pesanan
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Aksi cepat */}
      <section className="space-y-4">
        <SectionHeader title="Aksi Cepat" />
        <div className="flex flex-wrap gap-2.5">
          <QuickAction href="/admin/produk?baru=1" label="Tambah Produk" icon="spark" primary />
          <QuickAction href="/admin/produk" label="Kelola Produk" icon="price_check" />
          <QuickAction href="/admin/kategori" label="Kelola Kategori" icon="book" />
          <QuickAction href="/admin/pesanan" label="Kelola Pesanan" icon="receipt_long" />
        </div>
      </section>
    </div>
  );
};
