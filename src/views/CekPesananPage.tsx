'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyOrder } from '../lib/orderStore';
import { VerifiedOrder } from '../types';
import { rupiah } from '../lib/config';
import { Icon } from '../components/Icon';

const STATUS: Record<VerifiedOrder['status'], { label: string; className: string }> = {
  PENDING_PAYMENT: { label: 'Menunggu Pembayaran', className: 'bg-gold-soft text-[#8a5a00]' },
  WAITING_VERIFICATION: { label: 'Menunggu Verifikasi', className: 'bg-surface text-ink' },
  VERIFIED: { label: 'Terverifikasi', className: 'bg-surface text-ink' },
  PROCESSING: { label: 'Diproses', className: 'bg-ink/10 text-ink' },
  SUCCESS: { label: 'Berhasil', className: 'bg-ink/10 text-ink' },
  FAILED: { label: 'Gagal', className: 'bg-accent-soft text-accent' },
  EXPIRED: { label: 'Kedaluwarsa', className: 'bg-accent-soft text-accent' },
};

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

export const CekPesananPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const run = async (inv: string, dest: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await verifyOrder(inv, dest);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Terjadi kesalahan saat memverifikasi.');
    setLoading(false);
  };

  // Auto-verifikasi bila datang dari tautan hasil transaksi (?inv=..&dest=..)
  useEffect(() => {
    const inv = searchParams.get('inv') || '';
    const dest = searchParams.get('dest') || '';
    if (inv) setInvoice(inv);
    if (dest) setDestination(dest);
    if (inv && dest) run(inv, dest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice.trim() || destination.replace(/\D/g, '').length < 4) {
      setError('Isi nomor invoice dan nomor tujuan (minimal 4 digit) untuk verifikasi.');
      return;
    }
    run(invoice, destination);
  };

  const copy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied((c) => (c === field ? null : c)), 1800);
    } catch {
      // abaikan
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Kepala */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider">
          <Icon name="search" className="w-3.5 h-3.5" />
          Pusat Bantuan
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Cek Pesanan
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Masukkan nomor invoice dan nomor tujuan untuk melihat status, serial number, atau token
          listrik kamu.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div>
          <label htmlFor="inv" className="block text-xs font-bold text-ink mb-2">
            Nomor invoice
          </label>
          <input
            id="inv"
            type="text"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value.toUpperCase())}
            placeholder="TPN-2026-XXXXX"
            className="w-full h-12 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink num-tabular uppercase focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>

        <div>
          <label htmlFor="dest" className="block text-xs font-bold text-ink mb-2">
            Nomor tujuan
          </label>
          <input
            id="dest"
            type="tel"
            inputMode="numeric"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="08xxxxxxxxxx / ID meter"
            className="w-full h-12 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink num-tabular focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
        >
          {loading ? 'Memverifikasi…' : 'Cek Pesanan'}
        </button>

        <p className="text-[11px] text-muted text-center">
          Nomor tujuan wajib sama dengan saat transaksi — sebagai perlindungan privasi, datanya
          ditampilkan tersamarkan.
        </p>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 animate-fade">
          <Icon name="alert" className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Hasil */}
      {result && (
        <div className="mt-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm animate-rise">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="check_circle" className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-ink num-tabular">{result.invoice}</span>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS[result.status].className}`}
            >
              {STATUS[result.status].label}
            </span>
          </div>

          <div className="rounded-xl border border-line divide-y divide-line px-4">
            <Row label="Layanan" value={result.serviceName} />
            <Row label="Provider" value={result.providerName} />
            <Row label="Nomor tujuan" value={result.maskedDestination} mono />
            <Row label="Nominal" value={result.nominalLabel} />
            <Row label="Total dibayar" value={rupiah(result.total)} />
            <Row label="Metode" value={result.paymentMethod} />
            <Row label="Waktu" value={result.createdAt} />
          </div>

          {result.token && (
            <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  Token Listrik 20 Digit
                </span>
                <button
                  type="button"
                  onClick={() => copy(result.token!.replace(/-/g, ''), 'token')}
                  className="text-[11px] font-bold text-accent hover:underline cursor-pointer"
                >
                  {copied === 'token' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <div className="font-mono text-sm font-black text-ink tracking-wider text-center py-2.5 bg-white rounded-lg border border-accent/20 num-tabular">
                {result.token}
              </div>
            </div>
          )}

          {result.serial && (
            <div className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="block text-[11px] text-muted">Serial Number (SN)</span>
                <span className="font-mono font-bold text-ink text-xs break-all">
                  {result.serial}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copy(result.serial!, 'serial')}
                aria-label="Salin serial number"
                className="w-8 h-8 rounded-lg border border-line text-muted hover:text-accent hover:border-accent flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Icon name={copied === 'serial' ? 'check' : 'copy'} className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <a
              href={result.supportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="chat" className="w-4 h-4" />
              Bantuan CS WhatsApp
            </a>
            <Link
              href="/"
              className="flex-1 h-11 rounded-xl border border-line text-ink-soft hover:bg-surface font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
            >
              Isi Ulang Lagi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};