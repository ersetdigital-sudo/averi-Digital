'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '../types';
import { adminVerify, listOrders } from '../lib/orderStore';
import { rupiah, QRIS, waLink, BRAND } from '../lib/config';
import { Icon } from '../components/Icon';

/** Panel verifikasi admin — satu-satunya tempat pembayaran jadi SUCCESS. */
export const AdminVerificationPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | 'loading'>('loading');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await listOrders();
    setOrders(all);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const verify = async (invoice: string, approve: boolean) => {
    setBusy(invoice);
    // Alur: WAITING_VERIFICATION → VERIFIED → PROCESSING → SUCCESS/FAILED.
    await adminVerify(invoice, approve);
    // Beri waktu state SUCCESS tersimpan sebelum daftar dimuat ulang.
    await new Promise((r) => setTimeout(r, 300));
    await load();
    setBusy(null);
  };

  const pending = orders === 'loading' ? [] : orders.filter((o) => o.status === 'WAITING_VERIFICATION');
  const recent = orders === 'loading' ? [] : orders.filter((o) => o.status !== 'WAITING_VERIFICATION').slice(0, 8);

  const LABEL: Record<string, string> = {
    PENDING_PAYMENT: 'Menunggu Pembayaran',
    WAITING_VERIFICATION: 'Menunggu Verifikasi',
    VERIFIED: 'Terverifikasi',
    PROCESSING: 'Diproses',
    SUCCESS: 'Berhasil',
    FAILED: 'Gagal',
    EXPIRED: 'Kedaluwarsa',
  };

  return (
    <div className="space-y-6">
      {/* Antrean verifikasi */}
      <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.12em] text-muted mb-3">
        Menunggu Verifikasi ({pending.length})
      </h2>

      {orders === 'loading' ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          Memuat antrean…
        </div>
      ) : pending.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <Icon name="check_circle" className="w-8 h-8 text-ink-soft mx-auto" />
          <p className="mt-3 text-sm font-semibold text-ink">Tidak ada antrean verifikasi</p>
          <p className="mt-1 text-xs text-muted">
            Semua laporan pembayaran sudah diperiksa.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((order) => (
            <div key={order.invoice} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    {order.invoice}
                  </span>
                  <p className="text-sm font-bold text-ink mt-0.5">{order.serviceName}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {order.providerName} · {order.nominalLabel} · {order.destination}
                  </p>
                  <p className="text-xs text-muted mt-0.5">Metode: {QRIS.method} · {order.createdAt}</p>
                </div>
                <p className="text-lg font-extrabold text-ink num-tabular">{rupiah(order.total)}</p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => verify(order.invoice, true)}
                  disabled={busy === order.invoice}
                  className="flex-1 min-h-[48px] rounded-xl bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Icon name="check" className="w-4 h-4" />
                  {busy === order.invoice ? 'Memproses…' : 'Pembayaran Valid — Proses Pesanan'}
                </button>
                <button
                  type="button"
                  onClick={() => verify(order.invoice, false)}
                  disabled={busy === order.invoice}
                  className="flex-1 min-h-[48px] rounded-xl border-[1.5px] border-line text-ink hover:border-accent hover:text-accent disabled:opacity-60 font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Icon name="alert" className="w-4 h-4" />
                  Pembayaran Tidak Ditemukan — Tolak
                </button>
                <a
                  href={waLink(
                    `Halo CS ${BRAND.name}, saya ingin menanyakan pembayaran invoice ${order.invoice}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 rounded-xl border-[1.5px] border-line text-ink-soft hover:border-accent hover:text-accent font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Icon name="whatsapp" className="w-4 h-4" />
                  Cek Bukti
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Riwayat terbaru */}
      <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.12em] text-muted mb-3">
        Transaksi Terbaru
      </h2>
      <div className="rounded-2xl border border-line bg-white divide-y divide-line overflow-hidden">
        {recent.length === 0 ? (
          <p className="p-6 text-xs text-muted text-center">Belum ada transaksi.</p>
        ) : (
          recent.map((order) => (
            <div
              key={order.invoice}
              className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink num-tabular">{order.invoice}</p>
                <p className="text-[11px] text-muted truncate">
                  {order.serviceName} · {order.destination}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-ink num-tabular">{rupiah(order.total)}</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-surface text-ink uppercase tracking-wider whitespace-nowrap">
                  {LABEL[order.status] ?? order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-xl border-[1.5px] border-line text-ink-soft hover:bg-surface font-semibold text-sm transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};
