'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../components/Icon';
import { BRAND, waLink } from '../lib/config';

interface Faq {
  q: string;
  a: string;
  cat: string;
}

const FAQS: Faq[] = [
  {
    cat: 'Transaksi',
    q: 'Berapa lama pulsa atau paket data masuk setelah pembayaran?',
    a: 'Umumnya diproses otomatis oleh biller dalam 5–60 detik setelah pembayaran QRIS terkonfirmasi.',
  },
  {
    cat: 'Transaksi',
    q: 'Bagaimana bila saldo terpotong tapi pulsa belum bertambah?',
    a: 'Buka halaman Cek Pesanan dengan nomor invoice dan nomor tujuanmu. Jika biller sedang gangguan, CS WhatsApp kami akan membantu pengecekan atau rekonsiliasi.',
  },
  {
    cat: 'PLN',
    q: 'Di mana saya bisa melihat 20 digit token listrik PLN?',
    a: 'Token tampil di layar sukses setelah pembayaran. Kamu juga bisa melihatnya kembali kapan saja melalui halaman Cek Pesanan.',
  },
  {
    cat: 'PLN',
    q: 'Apakah pembelian token PLN dibatasi jam operasional?',
    a: 'PLN memiliki periode maintenance harian sekitar 23:30–00:30 WIB. Di luar jam itu, layanan aktif 24 jam.',
  },
  {
    cat: 'Pembayaran',
    q: 'Apakah ada biaya admin tambahan untuk QRIS?',
    a: 'Tidak ada. Kamu hanya membayar nominal total yang tertera pada langkah konfirmasi.',
  },
  {
    cat: 'Pembayaran',
    q: 'Aplikasi apa saja yang bisa dipakai untuk scan QRIS?',
    a: 'Semua mobile banking (BCA, Mandiri, BRI, BNI, dan lainnya) serta e-wallet resmi (GoPay, DANA, OVO, ShopeePay, LinkAja).',
  },
  {
    cat: 'Privasi',
    q: 'Mengapa Cek Pesanan butuh nomor tujuan, bukan hanya invoice?',
    a: 'Sebagai perlindungan privasi: rincian transaksi hanya bisa diakses pihak yang mengetahui informasi spesifik transaksi tersebut.',
  },
  {
    cat: 'Privasi',
    q: 'Apakah data nomor saya ditampilkan utuh?',
    a: 'Tidak. Nomor tujuan selalu disamarkan (contoh: 0812 •••• 7890) pada tampilan hasil pencarian.',
  },
];

const CATS = ['Semua', 'Transaksi', 'PLN', 'Pembayaran', 'Privasi'];

export const BantuanPage: React.FC = () => {
  const [cat, setCat] = useState('Semua');
  const [open, setOpen] = useState<number | null>(0);

  const list = cat === 'Semua' ? FAQS : FAQS.filter((f) => f.cat === cat);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider">
          <Icon name="help" className="w-3.5 h-3.5" />
          Dukungan
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Pusat Bantuan
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Temukan jawaban cepat, atau hubungi CS WhatsApp kami pada pukul {BRAND.csHours}.
        </p>
      </div>

      {/* Kartu bantuan cepat */}
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-line bg-white p-5 flex items-start gap-4 hover:border-accent transition-colors"
        >
          <span className="w-10 h-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Icon name="chat" className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink">Chat CS WhatsApp</span>
            <span className="block text-xs text-muted mt-1">
              Respon rata-rata 1–3 menit pada jam operasional.
            </span>
          </span>
        </a>

        <Link
          href="/cek-pesanan"
          className="rounded-2xl border border-line bg-white p-5 flex items-start gap-4 hover:border-accent transition-colors"
        >
          <span className="w-10 h-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Icon name="search" className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink">Cek Status Pesanan</span>
            <span className="block text-xs text-muted mt-1">
              Lihat status, SN biller, atau token kWh secara mandiri.
            </span>
          </span>
        </Link>
      </div>

      {/* FAQ */}
      <section className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-sm">
        <h2 className="text-lg font-extrabold text-ink mb-4">Pertanyaan yang sering diajukan</h2>

        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-line">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCat(c);
                setOpen(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                cat === c ? 'bg-ink text-white' : 'bg-surface text-ink-soft hover:bg-line'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {list.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-xl border border-line overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-surface transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-ink">{f.q}</span>
                  <Icon
                    name="chevron_down"
                    className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-xs text-ink-soft leading-relaxed border-t border-line pt-3.5">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};