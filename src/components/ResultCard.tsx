'use client';

import React, { useState } from 'react';
import { Order } from '../types';
import { Icon } from './Icon';
import { BRAND, rupiah } from '../lib/config';

interface Props {
  order: Order;
  onRestart: () => void;
  /** Tombol utama bawah: navigasi pulang (mis. ke /checkout). */
  onHome: () => void;
  /** Teks tombol utama. */
  homeLabel?: string;
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

/** Panel hasil transaksi sukses. */
export const ResultCard: React.FC<Props> = ({ order, onRestart, onHome, homeLabel }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied((c) => (c === field ? null : c)), 1800);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <div className="animate-rise">
      {/* Kepala sukses */}
      <div className="flex flex-col items-center text-center">
        <svg viewBox="0 0 48 48" className="w-16 h-16" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="none"
            stroke="#166b4d"
            strokeWidth="3"
            className="animate-ring"
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
          />
          <path
            d="M15 24.5 L21.5 31 L33 18"
            fill="none"
            stroke="#166b4d"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-tick"
          />
        </svg>
        <h2 className="text-xl font-extrabold text-ink mt-4">Transaksi Berhasil</h2>
        <p className="text-xs text-muted mt-1">
          {order.serviceName} untuk {order.destination} sudah diproses.
        </p>
      </div>

      {/* Rincian */}
      <div className="mt-6 rounded-xl border border-line divide-y divide-line px-4">
        <Row label="Invoice" value={order.invoice} mono />
        <Row label="Provider" value={order.providerName} />
        <Row label="Nominal" value={order.nominalLabel} />
        <Row label="Total dibayar" value={rupiah(order.total)} />
        <Row label="Waktu" value={order.createdAt} />
      </div>

      {/* Token PLN */}
      {order.token && (
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft/40 p-4 animate-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              Token Listrik 20 Digit
            </span>
            <button
              type="button"
              onClick={() => copy(order.token!.replace(/-/g, ''), 'token')}
              className="text-[11px] font-bold text-accent hover:underline cursor-pointer"
            >
              {copied === 'token' ? 'Tersalin' : 'Salin'}
            </button>
          </div>
          <div className="font-mono text-sm font-black text-ink tracking-wider text-center py-2.5 bg-white rounded-lg border border-accent/20 num-tabular">
            {order.token}
          </div>
        </div>
      )}

      {/* Serial number */}
      {order.serial && (
        <div className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[11px] text-muted">Serial Number (SN)</span>
            <span className="font-mono font-bold text-ink text-xs break-all">{order.serial}</span>
          </div>
          <button
            type="button"
            onClick={() => copy(order.serial!, 'serial')}
            aria-label="Salin serial number"
            className="w-8 h-8 rounded-lg border border-line text-muted hover:text-accent hover:border-accent flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Icon name={copied === 'serial' ? 'check' : 'copy'} className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Aksi */}
      <div className="mt-6 space-y-2">
        <a
          href={`/cek-pesanan?inv=${order.invoice}&dest=${order.destination}`}
          className="w-full h-12 rounded-xl bg-ink hover:bg-ink-soft text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="search" className="w-4 h-4" />
          Lacak Status Pesanan
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => copy(order.invoice, 'invoice')}
            className="flex-1 h-11 rounded-xl border border-line text-ink-soft hover:bg-surface font-bold text-xs transition-colors cursor-pointer"
          >
            {copied === 'invoice' ? 'Invoice Tersalin' : 'Salin Invoice'}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 h-11 rounded-xl border border-line text-ink-soft hover:bg-surface font-bold text-xs transition-colors cursor-pointer"
          >
            Transaksi Lagi
          </button>
        </div>
        <button
          type="button"
          onClick={onHome}
          className="w-full h-11 rounded-xl text-accent hover:bg-accent-soft font-bold text-xs transition-colors cursor-pointer"
        >
          {homeLabel ?? 'Kembali'}
        </button>
      </div>
    </div>
  );
};