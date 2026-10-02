'use client';

import React from 'react';
import { QRIS } from '../lib/config';

/**
 * Tampilan kode QRIS. Gambar TIDAK di-hardcode di UI — selalu dibaca dari
 * konfigurasi `QRIS.imageUrl` (env NEXT_PUBLIC_QRIS_IMAGE_URL atau file
 * default public/qris.svg) sehingga mudah diganti lewat config/admin.
 */
export const QrisDisplay: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="rounded-2xl border-[3px] border-ink bg-white p-3"
      style={{ width: size + 24, height: size + 24 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={QRIS.imageUrl}
        alt={`Kode QRIS ${QRIS.merchant}`}
        width={size}
        height={size}
        className="w-full h-full object-contain"
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        {QRIS.method}
      </span>
    </div>
  </div>
);
