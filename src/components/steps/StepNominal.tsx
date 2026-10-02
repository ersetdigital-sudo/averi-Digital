'use client';

import React from 'react';
import { ServiceId, Nominal, NominalTag } from '../../types';
import { NOMINALS } from '../../data/catalog';
import { rupiah } from '../../lib/config';

interface Props {
  service: ServiceId;
  value: Nominal | null;
  onSelect: (nominal: Nominal) => void;
}

const TAG_STYLE: Record<NominalTag, string> = {
  POPULER: 'bg-accent text-white',
  HEMAT: 'bg-gold text-[#4a3800]',
  PROMO: 'bg-ink/10 text-ink',
};

/** Langkah 3 — pilih nominal. */
export const StepNominal: React.FC<Props> = ({ service, value, onSelect }) => (
  <div className="grid grid-cols-2 gap-3">
    {NOMINALS[service].map((n) => {
      const active = value?.id === n.id;
      return (
        <button
          key={n.id}
          type="button"
          onClick={() => onSelect(n)}
          className={`relative text-left rounded-xl border p-4 transition-all cursor-pointer ${
            active
              ? 'border-accent bg-accent-soft/50 ring-1 ring-accent'
              : 'border-line bg-white hover:border-accent/60 hover:bg-surface'
          }`}
        >
          {n.tag && (
            <span
              className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${TAG_STYLE[n.tag]}`}
            >
              {n.tag}
            </span>
          )}
          <span className="block text-base font-extrabold text-ink num-tabular">{n.label}</span>
          <span className="block text-xs text-muted mt-0.5">{n.note}</span>
          <span className="block text-sm font-bold text-accent mt-2.5 num-tabular">
            {rupiah(n.price)}
          </span>
        </button>
      );
    })}
  </div>
);