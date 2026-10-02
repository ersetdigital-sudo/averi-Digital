'use client';

import React from 'react';
import Link from 'next/link';
import { useCheckoutForm } from '../checkout/useCheckout';
import { rupiah } from '../lib/config';
import { QRIS } from '../lib/config';
import { Icon } from '../components/Icon';

/** Halaman /checkout — form ringkas + ringkasan pesanan (sticky). */
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/katalog" className="hover:text-accent font-medium">
          Katalog
        </Link>
        <Icon name="chevron_right" className="w-3 h-3" />
        <Link href={`/produk/${product.slug}`} className="hover:text-accent font-medium">
          {product.name}
        </Link>
        <Icon name="chevron_right" className="w-3 h-3" />
        <span className="text-ink font-semibold">Checkout</span>
      </nav>

      <h1 className="text-2xl sm:text-[30px] font-extrabold tracking-[-0.03em] text-ink">
        Checkout
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Periksa pesanan, masukkan nomor tujuan, lalu bayar dengan {QRIS.method}.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ---------- Form ---------- */}
        <form
          onSubmit={submit}
          className="rounded-2xl border border-line bg-white p-5 sm:p-7 space-y-5"
        >
          <div>
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
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Periksa ulang nomor sebelum membayar — transaksi digital tidak dapat dibatalkan.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-gold/40 bg-gold-soft p-3.5 flex items-start gap-2.5 animate-fade">
              <Icon name="alert" className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-gold hover:bg-gold-dark disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Icon name="qr" className="w-4.5 h-4.5" />
            {submitting ? 'Memproses…' : `Bayar dengan QRIS · ${rupiah(product.price)}`}
          </button>

          <p className="text-[11px] text-muted text-center">
            Kamu akan diarahkan ke halaman pembayaran QRIS.
          </p>
        </form>

        {/* ---------- Ringkasan sticky ---------- */}
        <aside className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Ringkasan Pesanan
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl grid place-items-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: product.providerSwatch }}
            >
              {product.providerName.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted truncate">
                {product.providerName}
              </p>
              <p className="text-sm font-bold text-ink truncate">{product.name}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line divide-y divide-line px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-muted">Produk</span>
              <span className="text-xs font-bold text-ink text-right">{product.name}</span>
            </div>
            {product.isBill && (
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-xs text-muted">Periode</span>
                <span className="text-xs font-bold text-ink text-right">
                  {product.nominalLabel}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-muted">Biaya admin</span>
              <span className="text-xs font-bold text-accent">Rp0</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs font-bold text-ink">Total</span>
              <span className="text-sm font-extrabold text-ink num-tabular">
                {rupiah(product.price)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted">
            <Icon name="shield" className="w-4 h-4 text-accent shrink-0" />
            Pembayaran terenkripsi · Bukti transaksi tersimpan otomatis
          </div>
        </aside>
      </div>
    </div>
  );
};
