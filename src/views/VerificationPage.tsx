'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '../types';
import { getOrderByInvoice } from '../lib/orderStore';
import { rupiah, QRIS, waLink, BRAND } from '../lib/config';
import { Icon } from '../components/Icon';

/** Item timeline status — done / active / upcoming. */
const TimelineItem: React.FC<{
  label: string;
  state: 'done' | 'active' | 'upcoming';
  last?: boolean;
}> = ({ label, state, last }) => (
  <li className="flex items-stretch gap-3">
    <div className="flex flex-col items-center">
      <span
        className={`w-6 h-6 rounded-full grid place-items-center shrink-0 text-[11px] font-bold ${
          state === 'done'
            ? 'bg-ink text-white'
            : state === 'active'
              ? 'border-2 border-ink text-ink bg-white'
              : 'border-2 border-line text-muted bg-white'
        }`}
      >
        {state === 'done' ? '✓' : state === 'active' ? '●' : ''}
      </span>
      {!last && <span className={`w-px flex-1 ${state === 'done' ? 'bg-ink' : 'bg-line'}`} />}
    </div>
    <span
      className={`pb-4 text-xs font-semibold leading-6 ${
        state === 'upcoming' ? 'text-muted' : 'text-ink'
      }`}
    >
      {label}
    </span>
  </li>
);

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <span className="text-xs text-muted shrink-0">{label}</span>
    <span className="text-xs font-bold text-ink text-right break-all num-tabular">{value}</span>
  </div>
);

/** Halaman /pembayaran/verifikasi/[invoice] — pembayaran dilaporkan, menunggu pemeriksaan admin. */
export const VerificationPage: React.FC = () => {
  const params = useParams<{ invoice: string }>();
  const invoice = String(params.invoice || '');
  const [order, setOrder] = useState<Order | null | 'loading'>('loading');

  useEffect(() => {
    let alive = true;
    getOrderByInvoice(invoice).then((o) => alive && setOrder(o));
    return () => {
      alive = false;
    };
  }, [invoice]);

  // Status berubah (admin sudah memproses) → pindah halaman yang sesuai.
  useEffect(() => {
    if (!order || order === 'loading') return;
    if (order.status === 'SUCCESS') {
      window.location.assign(`/checkout/sukses?invoice=${encodeURIComponent(order.invoice)}`);
    } else if (order.status === 'PENDING_PAYMENT') {
      window.location.assign(`/pembayaran/${encodeURIComponent(order.invoice)}`);
    }
  }, [order]);

  if (order === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-muted">
        Memuat status verifikasi…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="w-12 h-12 rounded-2xl bg-gold-soft text-gold grid place-items-center mx-auto">
          <Icon name="alert" className="w-6 h-6" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
          Pesanan tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-muted">
          Invoice <span className="font-bold num-tabular">{invoice}</span> tidak tersedia di
          perangkat ini.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-sm transition-colors"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const failed = order.status === 'FAILED' || order.status === 'EXPIRED';
  const processing = order.status === 'VERIFIED' || order.status === 'PROCESSING';

  const headline = failed
    ? 'Pembayaran Tidak Ditemukan'
    : processing
      ? 'Pembayaran Terverifikasi'
      : 'Pembayaran Sedang Diverifikasi';

  const bodyText = failed
    ? 'Pembayaran tidak dapat ditemukan atau belum terkonfirmasi. Silakan periksa kembali atau buat pesanan baru.'
    : processing
      ? 'Pembayaran kamu sudah dikonfirmasi dan transaksi sedang diproses.'
      : 'Terima kasih. Kami sudah menerima laporan pembayaran kamu. Tim kami akan memeriksa pembayaran sebelum transaksi diproses.';

  const badgeLabel = failed ? 'PERLU VERIFIKASI ULANG' : processing ? 'DIPROSES' : 'MENUNGGU VERIFIKASI';
  const badgeClass = failed
    ? 'bg-accent-soft text-accent border border-accent/20'
    : 'bg-surface text-ink border border-line';

  // Timeline: 3 langkah awal selesai saat laporan diterima.
  const reported = !failed;
  const timeline: { label: string; state: 'done' | 'active' | 'upcoming' }[] = [
    { label: 'Pesanan Dibuat', state: 'done' },
    { label: 'QRIS Dibuat', state: 'done' },
    { label: 'Pembayaran Dilaporkan', state: reported ? 'done' : 'active' },
    {
      label: failed ? 'Verifikasi Gagal' : 'Menunggu Verifikasi',
      state: failed ? 'done' : processing ? 'done' : 'active',
    },
    { label: 'Transaksi Diproses', state: processing ? 'active' : 'upcoming' },
    { label: 'Selesai', state: 'upcoming' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      {/* Status */}
      <div className="text-center">
        <span className="w-16 h-16 rounded-3xl bg-surface border border-line text-ink grid place-items-center mx-auto">
          <Icon name={failed ? 'alert' : 'clock'} className="w-8 h-8" />
        </span>
        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
          {headline}
        </h1>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[48ch] mx-auto">
          {bodyText}
        </p>
        {!failed && (
          <p className="mt-2 text-xs text-muted">
            Status akan berubah setelah pembayaran dikonfirmasi.
          </p>
        )}
        <span
          className={`mt-5 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}
        >
          <Icon name={failed ? 'alert' : 'clock'} className="w-4 h-4" />
          {badgeLabel}
        </span>
      </div>

      {/* Ringkasan pesanan */}
      <div className="mt-8 rounded-2xl border border-line bg-white overflow-hidden">
        <div className="px-5 sm:px-7 py-5 border-b border-line flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Invoice
            </span>
            <span className="text-base font-extrabold text-ink num-tabular">{order.invoice}</span>
          </div>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-surface text-ink uppercase tracking-wider">
            {badgeLabel}
          </span>
        </div>
        <div className="px-5 sm:px-7 divide-y divide-line">
          <Row label="Produk" value={order.serviceName} />
          <Row label="Provider" value={order.providerName} />
          <Row label="Nominal" value={order.nominalLabel} />
          <Row label="Metode" value={QRIS.method} />
        </div>
        <div className="px-5 sm:px-7 py-3.5 bg-surface flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-ink">Total</span>
          <span className="text-lg font-extrabold text-ink num-tabular">{rupiah(order.total)}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 rounded-2xl border border-line bg-white p-5 sm:p-7">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-4">
          Status Transaksi
        </h2>
        <ol>
          {timeline.map((step, i) => (
            <TimelineItem
              key={step.label}
              label={step.label}
              state={step.state}
              last={i === timeline.length - 1}
            />
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[48px] w-full rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Icon name="clock" className="w-4 h-4" />
          Refresh Status
        </button>
        <Link
          href="/cek-pesanan"
          className="min-h-[48px] w-full rounded-xl border-[1.5px] border-line text-ink font-semibold text-sm inline-flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-colors"
        >
          <Icon name="search" className="w-4 h-4" />
          Cek Pesanan
        </Link>
        <a
          href={waLink(
            `Halo CS ${BRAND.name}, saya sudah membayar invoice ${order.invoice} dan menunggu verifikasi.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] w-full rounded-xl border-[1.5px] border-line text-ink-soft font-semibold text-sm inline-flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-colors"
        >
          <Icon name="whatsapp" className="w-4 h-4" />
          Hubungi WhatsApp CS
        </a>
        {failed && (
          <Link
            href="/katalog"
            className="min-h-[48px] w-full rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            Buat Pesanan Baru
          </Link>
        )}
      </div>
    </div>
  );
};
