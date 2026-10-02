'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { findProductBySlug, resolveProductView, siblingProducts } from '../data/catalog';
import { rupiah, QRIS } from '../lib/config';
import { Icon } from '../components/Icon';

/** Halaman /produk/[slug] — detail produk + CTA ke checkout. */
export const ProductDetailPage: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug || '');
  const product = findProductBySlug(slug);
  const view = product ? resolveProductView(product) : null;
  const siblings = product
    ? siblingProducts(product)
        .map(resolveProductView)
        .filter((p) => p.slug !== product.slug)
    : [];

  if (!view) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="w-12 h-12 rounded-2xl bg-gold-soft text-gold grid place-items-center mx-auto">
          <Icon name="search" className="w-6 h-6" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
          Produk tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-muted">
          Produk dengan slug tersebut tidak tersedia di katalog.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-sm transition-colors"
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
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted mb-7" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent font-medium">
          Home
        </Link>
        <Icon name="chevron_right" className="w-3 h-3" />
        <Link href={`/katalog?cat=${view.category}`} className="hover:text-accent font-medium">
          {view.categoryName}
        </Link>
        <Icon name="chevron_right" className="w-3 h-3" />
        <span className="text-ink font-semibold">{view.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ---------- Detail ---------- */}
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center text-white text-sm font-extrabold shrink-0"
              style={{ backgroundColor: view.providerSwatch }}
            >
              {view.providerName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {view.providerName}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {view.categoryName}
              </p>
            </div>
            {view.badge && (
              <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded bg-gold text-white tracking-wider">
                {view.badge}
              </span>
            )}
          </div>

          <h1 className="mt-5 text-2xl sm:text-[32px] font-extrabold tracking-[-0.03em] text-ink leading-tight">
            {view.name}
          </h1>
          <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">{view.desc}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Kategori', value: view.categoryName },
              { label: 'Metode', value: QRIS.method },
              {
                label: 'Proses',
                value: view.isBill ? 'Realtime inquiry' : 'Otomatis < 1 menit',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-surface p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {item.label}
                </p>
                <p className="text-xs font-bold text-ink mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Variasi nominal dari provider yang sama */}
          {siblings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-3">
                Nominal lain dari {view.providerName}
              </h2>
              <div className="flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/produk/${s.slug}`}
                    className={`h-11 px-4 rounded-lg text-xs font-semibold num-tabular inline-flex items-center transition-colors ${
                      s.slug === view.slug
                        ? 'bg-ink text-white'
                        : 'border-[1.5px] border-line text-ink hover:border-accent hover:text-accent'
                    }`}
                  >
                    {s.nominalLabel}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Panel harga + CTA (sticky) ---------- */}
        <aside className="rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            {view.isBill ? 'Perkiraan tagihan' : 'Harga'}
          </p>
          <p className="mt-1.5 text-[30px] font-extrabold text-ink tracking-[-0.02em] num-tabular">
            {rupiah(view.price)}
          </p>
          <p className="mt-1.5 text-xs text-muted">
            {view.isBill ? view.nominalNote : `${view.nominalLabel} · ${view.nominalNote}`}
          </p>

          <Link
            href={`/checkout?product=${view.slug}`}
            className="mt-5 w-full h-12 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            Beli Sekarang
            <Icon name="arrow_right" className="w-4 h-4" />
          </Link>

          <div className="mt-4 space-y-2">
            {[
              'Tanpa biaya admin — harga bersih',
              'Diproses otomatis setelah QRIS dibayar',
              'Nomor tujuan tersamarkan & aman',
            ].map((t) => (
              <p key={t} className="flex items-center gap-2 text-xs text-ink-soft">
                <Icon name="check" className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={3} />
                {t}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
