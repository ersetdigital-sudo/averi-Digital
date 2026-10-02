'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { rupiah } from '../lib/config';

interface Props {
  invoice: string;
  merchant: string;
  amount: number;
  onPaid: () => void;
  onCancel: () => void;
}

/** Pseudo-acak deterministik dari string (untuk pola QR dekoratif). */
function pseudoGrid(seed: string, size: number): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const grid: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) row.push(rand() > 0.52);
    grid.push(row);
  }
  return grid;
}

const Finder: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    <rect x={x} y={y} width={7} height={7} rx={1.2} fill="#013c5b" />
    <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.8} fill="#ffffff" />
    <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.6} fill="#013c5b" />
  </>
);

const QrArt: React.FC<{ seed: string }> = ({ seed }) => {
  const size = 21;
  const grid = pseudoGrid(seed, size);
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-44 h-44" role="img" aria-label="Kode QRIS">
      <rect width={size} height={size} fill="#ffffff" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on && !inFinder(x, y) ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#013c5b" />
          ) : null
        )
      )}
      <Finder x={0} y={0} />
      <Finder x={size - 7} y={0} />
      <Finder x={0} y={size - 7} />
    </svg>
  );
};

/** Langkah pembayaran — QRIS dinamis + hitung mundur masa berlaku. */
export const QrisPanel: React.FC<Props> = ({ invoice, merchant, amount, onPaid, onCancel }) => {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="animate-rise flex flex-col items-center text-center">
      <span className="text-xs font-bold text-muted uppercase tracking-wider">
        Pembayaran QRIS
      </span>
      <h2 className="text-xl font-extrabold text-ink mt-1">Scan untuk membayar</h2>
      <p className="text-xs text-muted mt-1">
        Buka aplikasi bank atau e-wallet, lalu pindai kode di bawah.
      </p>

      <div className="mt-5 p-4 rounded-2xl border border-line bg-white shadow-sm">
        <QrArt seed={invoice} />
      </div>

      <div className="mt-4 w-full max-w-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Merchant</span>
          <span className="font-bold text-ink">{merchant}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1.5">
          <span className="text-muted">Invoice</span>
          <span className="font-bold text-ink num-tabular">{invoice}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
          <span className="text-xs text-muted">Total</span>
          <span className="text-lg font-extrabold text-accent num-tabular">{rupiah(amount)}</span>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ink-soft bg-surface border border-line px-3 py-1.5 rounded-full">
        <Icon name="clock" className="w-4 h-4 text-accent" />
        Berlaku {mm}:{ss}
      </div>

      <div className="mt-6 w-full max-w-xs space-y-2">
        <button
          type="button"
          onClick={onPaid}
          className="w-full h-12 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors cursor-pointer"
        >
          Saya Sudah Bayar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full h-11 rounded-xl border border-line text-ink-soft hover:bg-surface font-semibold text-xs transition-colors cursor-pointer"
        >
          Batalkan
        </button>
      </div>

      <p className="mt-4 text-[11px] text-muted max-w-xs">
        * Mode demo: tombol di atas menyimulasikan pembayaran berhasil. Pada produksi, status
        akan terverifikasi otomatis dari gateway QRIS.
      </p>
    </div>
  );
};