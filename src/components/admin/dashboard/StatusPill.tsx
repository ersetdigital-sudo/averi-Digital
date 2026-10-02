import React from 'react';
import type { OrderStatus } from '../../../types';

const TONE: Record<OrderStatus, string> = {
  SUCCESS: 'bg-success-soft text-success',
  VERIFIED: 'bg-accent-soft text-accent',
  PROCESSING: 'bg-accent-soft text-accent',
  PENDING_PAYMENT: 'bg-gold-soft text-gold',
  WAITING_VERIFICATION: 'bg-gold-soft text-gold',
  FAILED: 'bg-gold-soft text-gold',
  EXPIRED: 'bg-surface text-muted',
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Menunggu Bayar',
  WAITING_VERIFICATION: 'Menunggu Verifikasi',
  VERIFIED: 'Terverifikasi',
  PROCESSING: 'Diproses',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
};

/** Label status pesanan dengan warna konsisten di seluruh panel. */
export const StatusPill: React.FC<{ status: OrderStatus | string }> = ({ status }) => {
  const key = status as OrderStatus;
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        TONE[key] ?? 'bg-surface text-muted'
      }`}
    >
      {STATUS_LABEL[key] ?? status}
    </span>
  );
};
