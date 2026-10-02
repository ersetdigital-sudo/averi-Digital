'use client';

import React, { useState } from 'react';
import type { RevenuePoint } from '../../../app/actions/orders';
import { rupiah } from '../../../lib/config';
import { NUM } from './styles';

/**
 * Grafik batang minimal dari data pesanan nyata (7 hari terakhir).
 * Tooltip diposisikan dengan `clamp()` supaya tidak pernah keluar card.
 */
export const RevenueChart: React.FC<{ points: RevenuePoint[] }> = ({ points }) => {
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(...points.map((p) => p.revenue), 1);
  const total = points.reduce((sum, p) => sum + p.revenue, 0);
  const hovered = active === null ? null : points[active];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {points.length} Hari Terakhir
          </p>
          <p className={`mt-1 text-xl font-extrabold text-ink ${NUM}`}>{rupiah(total)}</p>
        </div>
        <p className="text-[11px] text-muted">
          {hovered ? `${hovered.orders} pesanan` : 'Arahkan kursor ke batang'}
        </p>
      </div>

      {/* Ruang tooltip — tinggi tetap supaya grafik tidak bergeser. */}
      <div className="relative mt-4">
        <div className="relative h-9" aria-live="polite">
          {hovered && (
            <div
              className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-white px-2.5 py-1.5 shadow-raised"
              style={{
                left: `clamp(66px, ${((active! + 0.5) / points.length) * 100}%, calc(100% - 66px))`,
              }}
            >
              <p className="text-[10px] font-semibold text-muted">{hovered.fullLabel}</p>
              <p className={`text-xs font-bold text-ink ${NUM}`}>{rupiah(hovered.revenue)}</p>
            </div>
          )}
        </div>

        <div className="flex h-40 items-end gap-1.5 sm:gap-2.5">
          {points.map((point, index) => {
            const height = Math.max(3, Math.round((point.revenue / max) * 100));
            const isActive = active === index;
            return (
              <button
                key={point.date}
                type="button"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                aria-label={`${point.fullLabel}: ${rupiah(point.revenue)} dari ${point.orders} pesanan`}
                className="group flex h-full min-w-0 flex-1 cursor-pointer flex-col items-stretch justify-end gap-1.5"
              >
                <span
                  className={`w-full rounded-t-md transition-colors ${
                    isActive ? 'bg-accent' : 'bg-accent/20 group-hover:bg-accent/50'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span
                  className={`truncate text-center text-[10px] font-semibold ${
                    isActive ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {point.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
