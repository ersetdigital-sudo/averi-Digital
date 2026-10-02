'use client';

import React from 'react';
import Link from 'next/link';
import { useCheckoutForm } from '../checkout/useCheckout';
import { rupiah, QRIS } from '../lib/config';
import { Icon } from '../components/Icon';

/** Halaman /checkout — alur sederhana: ringkasan → nomor tujuan → bayar. */
export const CheckoutPage: React.FC = () => {
  const { product, destination, error, submitting, handleDestination, submit } = useCheckoutForm();

  // Tanpa ?product= → arahkan ke katalog untuk memilih produk dulu.
  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="w-12 h-12 rounded-2xl bg-accent-soft text-accent grid place-items-center mx-auto">
          <Icon name="info" className="w-6 h-6" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
          Pilih produk dulu
        </h1>
        <p className="mt-2 text-sm text-muted">
          Checkout dilakukan dari halaman produk. Pilih produk dari katalog.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition-colors"
        >
          Ke Katalog
          <Icon name="arrow_right" className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Kepala halaman */}
      <div className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
          Checkout
        </span>
        <h1 className="mt-1.5 text-[26px] sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
          Selesaikan Pesanan
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Satu langkah lagi — bayar dengan {QRIS.method}.
        </p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-4">
        {/* ---------- Ringkasan produk ---------- */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center text-white text-sm font-extrabold shrink-0"
              style={{ backgroundColor: product.providerSwatch }}
            >
              {product.providerName.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted truncate">
                {product.providerName}
              </p>
              <p className="text-sm font-bold text-ink truncate">{product.name}</p>
            </div>
            <span className="text-lg font-extrabold text-ink num-tabular whitespace-nowrap">
              {rupiah(product.price)}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-xs">
            <span className="text-muted">Biaya admin</span>
            <span className="font-bold text-accent">Rp0</span>
          </div>
        </div>

        {/* ---------- Nomor tujuan ---------- */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <label htmlFor="dest" className="block text-xs font-bold text-ink mb-2">
            {product.categoryName === 'Pulsa' || product.categoryName === 'Paket Data'
              ? 'Nomor handphone'
              : 'Nomor tujuan'}
          </label>
          <input
            id="dest"
            type="tel"
            inputMode="numeric"
            value={destination}
            onChange={(e) => handleDestination(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full h-12 rounded-xl border-[1.5px] border-line bg-white px-4 text-[15px] font-semibold text-ink num-tabular focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
          {error ? (
            <div className="mt-3 rounded-xl border border-gold/40 bg-gold-soft p-3 flex items-start gap-2.5 animate-fade">
              <Icon name="alert" className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed">{error}</p>
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <Icon name="shield" className="w-3.5 h-3.5 text-accent shrink-0" />
              Periksa ulang nomor — transaksi digital tidak dapat dibatalkan.
            </p>
          )}
        </div>

        {/* ---------- CTA ---------- */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-13 rounded-2xl bg-gold hover:bg-gold-dark disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-gold/25"
        >
          <Icon name="qr" className="w-5 h-5" />
          {submitting ? 'Memproses…' : `Bayar dengan QRIS · ${rupiah(product.price)}`}
        </button>

        <p className="text-center text-[11px] text-muted">
          Kamu akan diarahkan ke halaman pembayaran QRIS.
        </p>
      </form>
    </div>
  );
};
