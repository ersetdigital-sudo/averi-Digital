'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../components/Icon';
import { BRAND } from '../lib/config';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Ketentuan umum',
    body: `Selamat datang di ${BRAND.name}. Dengan mengakses dan menggunakan platform kami untuk membeli pulsa, paket data, token listrik PLN, pembayaran tagihan, atau pengisian saldo e-wallet, kamu menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan pada halaman ini.`,
  },
  {
    title: '2. Transaksi & tanggung jawab data tujuan',
    body: 'Pengguna bertanggung jawab penuh atas kebenaran nomor handphone, nomor meter PLN, ID pelanggan, atau nomor kontrak tagihan yang dimasukkan. Kesalahan penulisan nomor tujuan yang menyebabkan produk terkirim ke pihak lain tidak dapat dibatalkan atau ditarik kembali oleh sistem biller.',
  },
  {
    title: '3. Pembayaran melalui QRIS',
    body: 'Pembayaran dilakukan memakai kode QRIS dinamis standar nasional. Setiap kode memiliki batas waktu pembayaran. Selesaikan pembayaran sebelum masa berlaku kode berakhir agar faktur dapat diverifikasi otomatis oleh gateway perbankan.',
  },
  {
    title: '4. Gangguan provider & kebijakan refund',
    body: 'Apabila terjadi gangguan pada operator telekomunikasi atau server PLN sehingga transaksi gagal namun dana sudah terpotong, tim kami akan melakukan rekonsiliasi dan memproses pengembalian dana sesuai bukti transaksi resmi.',
  },
  {
    title: '5. Kontak bantuan',
    body: `Untuk pertanyaan atau klarifikasi terkait transaksi, hubungi Customer Service resmi ${BRAND.name} melalui WhatsApp pada jam operasional ${BRAND.csHours}.`,
  },
];

export const SyaratKetentuanPage: React.FC = () => {
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
        Syarat &amp; Ketentuan
      </h1>
      <p className="mt-2 text-sm text-muted">
        Berlaku untuk seluruh pengguna platform {BRAND.name}.
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
            href="/kebijakan-privasi"
            className="text-xs font-bold text-muted hover:text-accent transition-colors"
          >
            Baca Kebijakan Privasi →
          </Link>
        </div>
      </div>
    </div>
  );
};