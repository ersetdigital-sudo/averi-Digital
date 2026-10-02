'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '../types';
import { getOrderByInvoice } from '../lib/orderStore';
import { rupiah, waLink, BRAND } from '../lib/config';
import { Icon } from '../components/Icon';

/** Halaman /checkout/sukses — ucapan terima kasih + detail transaksi. */
export const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const invoice = searchParams.get('invoice') || '';
  const [order, setOrder] = useState<Order | null | 'loading'>('loading');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    getOrderByInvoice(invoice).then((o) => alive && setOrder(o));
    return () => {
      alive = false;
    };
  }, [invoice]);

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // abaikan
    }
  };

  if (order === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-muted">
        Memuat transaksi…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-extrabold tracking-tight text-ink">Transaksi tidak ditemukan</h1>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-sm transition-colors"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isPending = order.status === 'PENDING';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header sukses */}
      <div className="text-center">
        <span className="w-16 h-16 rounded-3xl bg-accent text-white grid place-items-center mx-auto">
          <Icon name="check_circle" className="w-9 h-9" strokeWidth={2} />
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.035em] text-ink">
          {isPending ? 'Hampir Selesai!' : 'Terima Kasih!'}
        </h1>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          {isPending
            ? 'Pembayaranmu masih menunggu konfirmasi. Buka halaman pembayaran untuk menyelesaikannya.'
            : 'Transaksi berhasil. Rincian pesananmu tampil di bawah — simpan invoice untuk verifikasi.'}
        </p>
      </div>

      {isPending && (
        <Link
          href={`/pembayaran/${encodeURIComponent(order.invoice)}`}
          className="mt-8 flex-1 min-h-[44px] px-6 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          Lanjut ke Pembayaran
        </Link>
      )}

      {/* Detail transaksi */}
      <div className="mt-8 rounded-2xl border border-line bg-white overflow-hidden">
        <div className="px-5 sm:px-7 py-5 border-b border-line flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Invoice
            </span>
            <span className="text-base font-extrabold text-ink num-tabular">
              {order.invoice}
            </span>
          </div>
          <span
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
              isPending ? 'bg-gold-soft text-gold' : 'bg-accent-soft text-accent'
            }`}
          >
            {isPending ? 'Menunggu' : 'Berhasil'}
          </span>
        </div>

        <div className="px-5 sm:px-7 divide-y divide-line">
          {[
            ['Produk', order.serviceName],
            ['Provider', order.providerName],
            ['Nominal', order.nominalLabel],
            ['Nomor tujuan', order.destination],
            ['Metode', 'QRIS Standar Nasional'],
            ['Waktu', order.createdAt],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3">
              <span className="text-xs text-muted shrink-0">{label}</span>
              <span className="text-sm font-bold text-ink text-right break-all num-tabular">
                {value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 py-3.5 bg-surface -mx-5 sm:-mx-7 px-5 sm:px-7">
            <span className="text-xs font-bold text-ink">Total dibayar</span>
            <span className="text-lg font-extrabold text-accent num-tabular">
              {rupiah(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Token PLN */}
      {order.token && (
        <div className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft/40 p-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              Token Listrik 20 Digit
            </span>
            <button
              type="button"
              onClick={() => copyToken(order.token!)}
              className="text-[11px] font-bold text-accent hover:underline cursor-pointer"
            >
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
          <div className="font-mono text-base font-extrabold text-ink tracking-[0.15em] text-center py-3 bg-white rounded-xl border border-accent/20 num-tabular">
            {order.token}
          </div>
        </div>
      )}

      {/* Serial */}
      {order.serial && (
        <div className="mt-4 rounded-2xl border border-line bg-white px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[11px] text-muted">Serial Number (SN)</span>
            <span className="font-mono font-bold text-ink text-xs break-all">
              {order.serial}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <Link
          href="/cek-pesanan"
          className="flex-1 min-h-[44px] rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="search" className="w-4 h-4" />
          Cek Pesanan
        </Link>
        <Link
          href="/"
          className="flex-1 min-h-[44px] rounded-xl border-[1.5px] border-line text-ink-soft hover:bg-surface font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          Kembali ke Beranda
        </Link>
        <a
          href={waLink(
            `Halo CS ${BRAND.name}, transaksi saya dengan invoice ${order.invoice} sudah berhasil.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] rounded-xl border-[1.5px] border-line text-ink-soft hover:bg-surface font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="whatsapp" className="w-4 h-4" />
          Chat CS
        </a>
      </div>
    </div>
  );
};
