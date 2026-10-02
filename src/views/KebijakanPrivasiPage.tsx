'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../components/Icon';
import { BRAND } from '../lib/config';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Perlindungan privasi pelanggan',
    body: `Privasi kamu prioritas kami. ${BRAND.name} menerapkan prinsip minimalisasi data: hanya memproses informasi yang benar-benar diperlukan untuk memproses pengisian saldo, token, dan penerbitan faktur transaksi.`,
  },
  {
    title: '2. Penyamaran nomor tujuan',
    body: 'Untuk mencegah pihak lain mengintip atau mengekstrak nomor telepon maupun ID pelanggan secara massal, seluruh nomor tujuan pada faktur yang diakses publik ditampilkan dalam bentuk tersamarkan, contoh: 0812 •••• 7890.',
  },
  {
    title: '3. Verifikasi halaman Cek Pesanan',
    body: 'Pada halaman Cek Pesanan, sistem mewajibkan pencocokan ganda antara nomor invoice dan nomor tujuan transaksi. Dengan begitu, rincian faktur hanya dapat ditampilkan kepada pengguna yang mengetahui informasi spesifik transaksi tersebut.',
  },
  {
    title: '4. Keamanan transaksi & enkripsi',
    body: 'Data yang dikomunikasikan antara browser dan sistem gateway kami dienkripsi dengan protokol TLS 256-bit. Kami tidak menyimpan kredensial perbankan, PIN, atau data kartu pengguna.',
  },
];

export const KebijakanPrivasiPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors"
      >
        <Icon name="chevron_left" className="w-3.5 h-3.5" />
        Kembali ke beranda
      </Link>

      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
        Kebijakan Privasi
      </h1>
      <p className="mt-2 text-sm text-muted">
        Komitmen {BRAND.name} menjaga kerahasiaan data transaksi kamu.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title} className="space-y-2">
            <h2 className="text-base font-bold text-ink">{s.title}</h2>
            <p className="text-xs text-ink-soft leading-relaxed">{s.body}</p>
          </section>
        ))}

        <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xs font-bold text-accent hover:underline">
            ← Beranda
          </Link>
          <Link
            href="/syarat-ketentuan"
            className="text-xs font-bold text-muted hover:text-accent transition-colors"
          >
            Baca Syarat &amp; Ketentuan →
          </Link>
        </div>
      </div>
    </div>
  );
};