'use client';

import React from 'react';
import Link from 'next/link';
import { ProductView } from '../types';

/** Kartu produk marketplace — ringkas: provider, produk, nominal, harga, CTA. */
export const ProductCard: React.FC<{ product: ProductView }> = ({ product }) => (
  <article className="group flex flex-col rounded-2xl border border-line bg-white p-4 hover:border-accent hover:shadow-md transition-all">
    {/* Provider */}
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: product.providerSwatch }}
      />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted truncate">
        {product.providerName}
      </span>
      {product.badge && (
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold text-white tracking-wider shrink-0">
          {product.badge}
        </span>
      )}
    </div>

    {/* Produk (+ nominal utk kategori tagihan) */}
    <h3 className="mt-2.5 text-sm font-semibold text-ink tracking-tight leading-snug line-clamp-2">
      {product.name}
    </h3>
    {product.isBill && (
      <span className="mt-1 text-[11px] font-semibold text-ink-soft">{product.nominalLabel}</span>
    )}

    {/* Harga + CTA */}
    <div className="mt-auto pt-4 flex items-center justify-between gap-2">
      <span className="text-base font-bold text-ink num-tabular tracking-tight">
        Rp{product.price.toLocaleString('id-ID')}
      </span>
      <Link
        href={`/produk/${product.slug}`}
        className="h-11 px-4 rounded-lg bg-gold hover:bg-gold-dark text-white text-xs font-semibold inline-flex items-center transition-colors shrink-0"
      >
        Beli
      </Link>
    </div>
  </article>
);

/** Grid produk responsif: desktop 4 kolom, tablet 3, mobile 2. */
export const ProductGrid: React.FC<{ products: ProductView[] }> = ({ products }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
    {products.map((p) => (
      <ProductCard key={p.id} product={p} />
    ))}
  </div>
);
