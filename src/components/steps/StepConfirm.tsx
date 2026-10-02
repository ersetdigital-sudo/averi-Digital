'use client';

import React from 'react';
import { ServiceId, Provider, Nominal } from '../../types';
import { SERVICE_META } from '../../data/catalog';
import { rupiah } from '../../lib/config';
import { Icon } from '../Icon';

interface Props {
  service: ServiceId;
  provider: Provider;
  destination: string;
  nominal: Nominal;
}

const Row: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <span className="text-xs text-muted shrink-0">{label}</span>
    <span className={`text-sm font-bold text-ink text-right break-all ${mono ? 'num-tabular' : ''}`}>
      {value}
    </span>
  </div>
);

/** Langkah 4 — ringkasan sebelum pembayaran. */
export const StepConfirm: React.FC<Props> = ({ service, provider, destination, nominal }) => (
  <div className="space-y-4">
    <div className="rounded-xl border border-line divide-y divide-line px-4">
      <Row label="Layanan" value={SERVICE_META[service].name} />
      <Row label="Provider" value={provider.name} />
      <Row label={SERVICE_META[service].destLabel} value={destination || '-'} mono />
      <Row label="Nominal" value={nominal.label} />
      <Row label="Biaya admin" value={<span className="text-accent">Gratis</span>} />
    </div>

    <div className="rounded-xl bg-accent-soft/50 border border-accent/30 px-4 py-3.5 flex items-center justify-between">
      <span className="text-xs font-bold text-ink">Total pembayaran</span>
      <span className="text-lg font-extrabold text-accent num-tabular">{rupiah(nominal.price)}</span>
    </div>

    <p className="text-xs text-muted flex items-start gap-2">
      <Icon name="info" className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
      Metode pembayaran QRIS Standar Nasional. Kode QR akan tampil pada langkah pembayaran.
    </p>
  </div>
);