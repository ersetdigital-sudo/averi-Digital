'use client';

import React from 'react';
import { ServiceId } from '../../types';
import { Icon, IconName } from '../Icon';

interface Cat {
  key: string;
  title: string;
  blurb: string;
  icon: IconName;
  service: ServiceId;
  /** Dipakai untuk layanan `tagihan` agar provider langsung terpilih. */
  providerId?: string;
}

/**
 * Langkah 1 — **8 kategori layanan**. Empat kategori tagihan dipecah per
 * jenis tagihan (PDAM/BPJS/Internet/Multifinance), tapi tetap map ke layanan
 * `tagihan` dengan provider berbeda.
 */
const CATEGORIES: Cat[] = [
  {
    key: 'pulsa',
    title: 'Pulsa Reguler',
    blurb: 'Isi ulang pulsa semua operator',
    icon: 'call',
    service: 'pulsa',
  },
  {
    key: 'data',
    title: 'Paket Data',
    blurb: 'Kuota internet harian & bulanan',
    icon: 'wifi',
    service: 'data',
  },
  {
    key: 'pln',
    title: 'Token Listrik PLN',
    blurb: 'Token prabayar 20 digit',
    icon: 'bolt',
    service: 'pln',
  },
  {
    key: 'ewallet',
    title: 'Top Up E-Wallet',
    blurb: 'Saldo GoPay, DANA, OVO & lainnya',
    icon: 'wallet',
    service: 'ewallet',
  },
  {
    key: 'pdam',
    title: 'Tagihan PDAM',
    blurb: 'Air bersih & tagihan daerah',
    icon: 'water_drop',
    service: 'tagihan',
    providerId: 'pdam',
  },
  {
    key: 'bpjs',
    title: 'BPJS Kesehatan',
    blurb: 'Iuran kesehatan per keluarga',
    icon: 'health_and_safety',
    service: 'tagihan',
    providerId: 'bpjs',
  },
  {
    key: 'internet',
    title: 'Tagihan Internet',
    blurb: 'IndiHome & layanan rumah',
    icon: 'router',
    service: 'tagihan',
    providerId: 'indihome',
  },
  {
    key: 'multifinance',
    title: 'Multifinance',
    blurb: 'Angsuran & cicilan kredit',
    icon: 'payments',
    service: 'tagihan',
    providerId: 'multifinance',
  },
];

interface Props {
  /** Kunci kategori terpilih — hanya yang ini yang ditampilkan aktif. */
  selectedKey: string | null;
  /** (layanan, providerId opsional untuk kategori tagihan) */
  onSelect: (service: ServiceId, providerId?: string) => void;
}

export const StepCategory: React.FC<Props> = ({ selectedKey, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {CATEGORIES.map((c) => {
      const active = selectedKey === c.key;
      return (
        <button
          key={c.key}
          type="button"
          onClick={() => onSelect(c.service, c.providerId)}
          className={`text-left rounded-xl border p-4 flex items-start gap-3.5 transition-all cursor-pointer ${
            active
              ? 'border-accent bg-accent-soft/50 ring-1 ring-accent'
              : 'border-line bg-white hover:border-ink/30 hover:bg-surface'
          }`}
        >
          <span
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              active ? 'bg-accent text-white' : 'bg-surface text-accent'
            }`}
          >
            <Icon name={c.icon} className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink">{c.title}</span>
            <span className="block text-xs text-muted mt-0.5">{c.blurb}</span>
          </span>
        </button>
      );
    })}
  </div>
);