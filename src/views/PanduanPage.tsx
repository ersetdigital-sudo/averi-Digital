'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon, IconName } from '../components/Icon';
import { BRAND, waLink } from '../lib/config';

const FLOW: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'qr',
    title: 'Buka menu Scan QRIS',
    body: 'Buka aplikasi bank atau e-wallet, pilih fitur Pindai/Scan QRIS. Bila bertransaksi dari ponsel yang sama, screenshot lalu unggah dari galeri.',
  },
  {
    icon: 'check_circle',
    title: 'Periksa merchant & nominal',
    body: `Pastikan nama merchant pada aplikasi adalah ${BRAND.merchant} dan totalnya sesuai pesananmu.`,
  },
  {
    icon: 'shield',
    title: 'Konfirmasi PIN & selesai',
    body: 'Masukkan PIN keamananmu. Setelah pembayaran diverifikasi admin, invoice dan serial number/token tampil di halaman status pesanan.',
  },
];

interface AppGuide {
  name: string;
  tag: string;
  steps: string[];
}

const BANKS: AppGuide[] = [
  {
    name: 'BCA mobile / myBCA',
    tag: 'BCA',
    steps: [
      'Buka aplikasi BCA mobile atau myBCA.',
      'Pilih menu QRIS.',
      'Pindai kode atau unggah dari galeri.',
      `Periksa nama penerima: ${BRAND.merchant}.`,
      'Masukkan PIN m-BCA dan simpan bukti transaksi.',
    ],
  },
  {
    name: "Livin' by Mandiri",
    tag: 'LIVIN',
    steps: [
      "Buka aplikasi Livin' by Mandiri.",
      'Tekan menu QR Bayar.',
      'Pindai kode atau unggah screenshot QRIS.',
      'Pastikan nominal dan penerima sudah benar.',
      "Konfirmasi dengan PIN Livin'.",
    ],
  },
  {
    name: 'BRImo (Bank BRI)',
    tag: 'BRI',
    steps: [
      'Buka aplikasi BRImo.',
      'Tekan ikon QRIS pada beranda.',
      'Pindai kode atau unggah gambar QRIS.',
      'Periksa merchant dan rekening pendebetan.',
      'Masukkan PIN BRImo.',
    ],
  },
  {
    name: 'BNI Mobile Banking',
    tag: 'BNI',
    steps: [
      'Masuk ke BNI Mobile Banking.',
      'Pilih menu QRIS di navigasi bawah.',
      'Pindai kode atau pilih foto dari memori.',
      `Pastikan merchant ${BRAND.merchant}.`,
      'Ketik Password Transaksi BNI.',
    ],
  },
];

const WALLETS: AppGuide[] = [
  {
    name: 'GoPay / Gojek',
    tag: 'GOPAY',
    steps: [
      'Buka aplikasi Gojek atau GoPay.',
      'Tekan menu Bayar (ikon scan QR).',
      'Pindai barcode QRIS.',
      'Periksa penerima lalu tekan Konfirmasi & Bayar.',
      'Masukkan 6 digit PIN GoPay.',
    ],
  },
  {
    name: 'DANA',
    tag: 'DANA',
    steps: [
      'Buka aplikasi DANA.',
      'Pilih menu Scan QRIS.',
      'Pindai kode QRIS Averi Digital.',
      'Periksa detail transaksi.',
      'Konfirmasi dengan PIN DANA.',
    ],
  },
  {
    name: 'OVO',
    tag: 'OVO',
    steps: [
      'Buka aplikasi OVO.',
      'Tekan ikon Scan di tengah bawah.',
      'Pindai kode QRIS.',
      'Periksa nominal dan penerima.',
      'Masukkan PIN OVO untuk menyelesaikan.',
    ],
  },
  {
    name: 'ShopeePay',
    tag: 'SPAY',
    steps: [
      'Buka aplikasi Shopee.',
      'Pilih tab ShopeePay lalu Scan.',
      'Pindai kode QRIS.',
      'Pastikan detail pembayaran benar.',
      'Konfirmasi dengan PIN ShopeePay.',
    ],
  },
];

const GuideList: React.FC<{ guides: AppGuide[] }> = ({ guides }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2.5">
      {guides.map((g, i) => {
        const isOpen = open === i;
        return (
          <div key={g.name} className="rounded-xl border border-line bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-surface transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-accent bg-accent-soft px-2 py-1 rounded">
                  {g.tag}
                </span>
                <span className="text-sm font-bold text-ink">{g.name}</span>
              </span>
              <Icon
                name="chevron_down"
                className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <ol className="px-4 pb-4 space-y-2 border-t border-line pt-3.5">
                {g.steps.map((s, si) => (
                  <li key={si} className="flex gap-2.5 text-xs text-ink-soft leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-accent-soft text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 num-tabular">
                      {si + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
};
export const PanduanPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider">
          <Icon name="book" className="w-3.5 h-3.5" />
          Panduan
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Cara Bayar dengan QRIS
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Tiga langkah singkat, lalu pilih panduan sesuai aplikasi yang kamu pakai.
        </p>
      </div>

      {/* Alur dasar */}
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FLOW.map((f, i) => (
          <div key={f.title} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                <Icon name={f.icon} className="w-5 h-5" />
              </span>
              <span className="text-2xl font-black text-line num-tabular">0{i + 1}</span>
            </div>
            <h3 className="text-sm font-bold text-ink">{f.title}</h3>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Per aplikasi */}
      <section className="mt-12">
        <h2 className="text-lg font-extrabold text-ink">Panduan per aplikasi</h2>
        <p className="text-xs text-muted mt-1 mb-5">
          Pilih aplikasi untuk melihat langkah detailnya.
        </p>

        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
          Mobile banking
        </h3>
        <GuideList guides={BANKS} />

        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mt-8 mb-3">
          E-wallet
        </h3>
        <GuideList guides={WALLETS} />
      </section>

      {/* Kendala */}
      <section className="mt-12 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-base font-extrabold text-ink">
          Pembayaran berhasil tapi pesanan belum masuk?
        </h2>
        <ul className="mt-4 space-y-2.5">
          {[
            'Buka halaman Cek Pesanan dan pastikan status transaksi masih diproses biller.',
            'Periksa kembali kebenaran nomor tujuan yang kamu masukkan.',
            'Simpan bukti transfer dari aplikasi bank atau e-wallet.',
            'Hubungi CS WhatsApp dengan melampirkan nomor invoice dan bukti transaksi.',
          ].map((t) => (
            <li key={t} className="flex gap-2.5 text-xs text-ink-soft leading-relaxed">
              <Icon
                name="check"
                className="w-3.5 h-3.5 mt-0.5 text-accent shrink-0"
                strokeWidth={3}
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="bolt" className="w-4 h-4" />
          Mulai Isi Ulang
        </Link>
        <a
          href={waLink(`Halo CS ${BRAND.name}, saya butuh bantuan pembayaran QRIS.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 rounded-xl border border-line text-ink-soft hover:bg-surface font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="chat" className="w-4 h-4" />
          Chat CS WhatsApp
        </a>
      </div>
    </div>
  );
};