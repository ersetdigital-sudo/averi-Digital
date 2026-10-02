'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '../types';
import { getOrderByInvoice, reportPayment } from '../lib/orderStore';
import { rupiah, QRIS } from '../lib/config';
import { fetchPublicSettings } from '../app/actions/settings';
import { DEFAULT_SETTINGS, type PublicSettings } from '../lib/public-settings';
import { QrisDisplay } from '../components/QrisDisplay';
import { Icon } from '../components/Icon';

/** Halaman /pembayaran/[invoice] — QRIS + status pembayaran. */
export const PaymentPage: React.FC = () => {
  const params = useParams<{ invoice: string }>();
  const invoice = String(params.invoice || '');


  const [order, setOrder] = useState<Order | null | 'loading'>('loading');
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_SETTINGS);
  const [processing, setProcessing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QRIS.ttlMinutes * 60);

  // Muat pesanan
  useEffect(() => {
    let alive = true;
    getOrderByInvoice(invoice)
      .then((o) => alive && setOrder(o))
      .catch(() => alive && setOrder(null));
    return () => {
      alive = false;
    };
  }, [invoice]);

  // Setelan dari Supabase (gambar QRIS, merchant, jam CS) — bisa diubah tanpa deploy.
  useEffect(() => {
    let alive = true;
    fetchPublicSettings()
      .then((s) => alive && setSettings(s))
      // Setelan gagal dimuat bukan alasan menahan pesanan — pakai cadangan config.
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  // Pesanan sudah sukses → halaman sukses. Sedang menunggu/memproses →
  // halaman verifikasi. Hanya PENDING_PAYMENT yang tetap di QRIS.
  useEffect(() => {
    if (!order || order === 'loading' || order.status === 'PENDING_PAYMENT') return;
    if (order.status === 'SUCCESS') {
      window.location.assign(`/checkout/sukses?invoice=${encodeURIComponent(order.invoice)}`);
    } else {
      window.location.assign(`/pembayaran/verifikasi/${encodeURIComponent(order.invoice)}`);
    }
  }, [order]);

  // Hitung mundur masa berlaku kode QRIS.
  useEffect(() => {
    if (!order || order === 'loading' || order.status !== 'PENDING_PAYMENT') return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [order]);

  /**
   * "Saya Sudah Bayar" HANYA laporan bahwa user sudah membayar — bukan bukti
   * pembayaran terverifikasi. Status menjadi WAITING_VERIFICATION dan user
   * diarahkan ke halaman verifikasi; serial/token/sukses belum boleh muncul.
   */
  const confirmPaid = async () => {
    if (!order || order === 'loading' || processing) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    await reportPayment(order.invoice);
    // Navigasi penuh (bukan router client) agar status terbaru selalu termuat —
    // router client bisa macet saat sesi sudah lama.
    window.location.assign(`/pembayaran/verifikasi/${encodeURIComponent(order.invoice)}`);
  };

  if (order === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-muted">
        Memuat pesanan…
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

  const expired = secondsLeft <= 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            Pembayaran QRIS
          </span>
          <h1 className="mt-1.5 text-2xl sm:text-[30px] font-extrabold tracking-[-0.03em] text-ink num-tabular">
            {order.invoice}
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-gold-soft text-gold text-[11px] font-bold uppercase tracking-wider">
          <Icon name="clock" className="w-4 h-4" />
          Menunggu Pembayaran
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-start">
        {/* ---------- QRIS ---------- */}
        <div className="rounded-2xl border border-line bg-white p-6 flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Total Bayar
            </p>
            <p className="text-[28px] font-extrabold text-ink tracking-[-0.02em] num-tabular leading-tight">
              {rupiah(order.total)}
            </p>
          </div>

          {expired ? (
            <div className="py-10 text-center">
              <Icon name="alert" className="w-10 h-10 text-gold mx-auto" />
              <p className="mt-3 text-sm font-bold text-ink">Kode QRIS kedaluwarsa</p>
              <p className="mt-1 text-xs text-muted">Buat pesanan baru untuk mencoba lagi.</p>
              <Link
                href="/katalog"
                className="mt-4 inline-flex h-11 px-5 rounded-xl bg-accent text-white text-xs font-semibold items-center hover:bg-accent-dark transition-colors"
              >
                Pesan Ulang
              </Link>
            </div>
          ) : (
            <>
              <QrisDisplay size={200} src={settings.qrisImageUrl} merchant={settings.qrisMerchant} />
              <div className="text-center">
                <p className="text-xs font-bold text-ink">{settings.qrisMerchant}</p>
                <p className="mt-1 text-[11px] text-muted num-tabular">
                  Berlaku {mm}:{ss} menit
                </p>
              </div>
            </>
          )}
        </div>

        {/* ---------- Detail & instruksi ---------- */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-4">
              Detail Pesanan
            </h2>
            <div className="rounded-xl border border-line divide-y divide-line px-4">
              {[
                ['Produk', order.serviceName],
                ['Provider', order.providerName],
                ['Nominal', order.nominalLabel],
                ['Nomor tujuan', order.destination],
                ['Metode', QRIS.method],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-xs text-muted shrink-0">{label}</span>
                  <span className="text-xs font-bold text-ink text-right break-all num-tabular">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-3">
              Cara Membayar
            </h2>
            <ol className="space-y-2.5">
              {[
                'Buka aplikasi bank atau e-wallet, pilih menu Scan QRIS.',
                'Pindai kode di sebelah kiri (atau unggah dari galeri).',
                `Periksa merchant ${settings.qrisMerchant} dan totalnya.`,
                'Konfirmasi dengan PIN, lalu tekan tombol di bawah.',
              ].map((s, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-ink-soft leading-relaxed">
                  <span className="w-4.5 h-4.5 rounded-full bg-accent-soft text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 num-tabular">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={confirmPaid}
              disabled={expired || processing}
              className="flex-1 h-12 rounded-xl bg-gold hover:bg-gold-dark disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Icon name="clock" className="w-4 h-4 animate-spin" />
                  Memeriksa pembayaran…
                </>
              ) : (
                <>
                  <Icon name="check_circle" className="w-4.5 h-4.5" />
                  Saya Sudah Bayar
                </>
              )}
            </button>
            <a
              href={`https://wa.me/${settings.whatsappCs.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Halo CS ${settings.siteName}, saya butuh bantuan pembayaran invoice ${order.invoice}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-5 rounded-xl border-[1.5px] border-line text-ink font-semibold text-sm inline-flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-colors"
            >
              <Icon name="whatsapp" className="w-4 h-4" />
              Butuh Bantuan
            </a>
          </div>
          <p className="text-[11px] text-muted text-center sm:text-left">
            Setelah kamu menekan tombol ini, pembayaranmu akan diperiksa tim kami terlebih dahulu
            sebelum transaksi diproses.
          </p>
        </div>
      </div>
    </div>
  );
};
