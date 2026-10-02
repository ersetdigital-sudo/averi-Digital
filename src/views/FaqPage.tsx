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
    a: 'Setelah pembayaran diverifikasi admin, pesanan diteruskan ke provider. Waktu prosesnya berbeda-beda tergantung layanan yang dipilih.',
  },
  {
    cat: 'Transaksi',
    q: 'Bagaimana bila saldo terpotong tapi pulsa belum bertambah?',
    a: 'Buka halaman Cek Pesanan dengan nomor invoice dan nomor tujuanmu. Jika biller sedang gangguan, CS WhatsApp kami akan membantu pengecekan atau rekonsiliasi.',
  },
  {
    cat: 'PLN',
    q: 'Di mana saya bisa melihat 20 digit token listrik PLN?',
    a: 'Token tampil di halaman status setelah pembayaran diverifikasi admin. Kamu juga bisa melihatnya kembali kapan saja melalui halaman Cek Pesanan.',
  },
  {
    cat: 'PLN',
    q: 'Apakah pembelian token PLN dibatasi jam operasional?',
    a: 'PLN memiliki periode maintenance harian sekitar 23:30–00:30 WIB. Di luar jam itu, transaksi tetap dapat diproses.',
  },
  {
    cat: 'Pembayaran',
    q: 'Apakah ada biaya admin tambahan untuk QRIS?',
    a: 'Tidak ada. Kamu hanya membayar nominal total yang tertera pada halaman checkout.',
  },
  {
    cat: 'Pembayaran',
    q: 'Aplikasi apa saja yang bisa dipakai untuk scan QRIS?',
    a: 'Semua mobile banking (BCA, Mandiri, BRI, BNI, dan lainnya) serta e-wallet seperti GoPay, DANA, OVO, ShopeePay, dan LinkAja.',
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

/** Halaman /faq — daftar pertanyaan umum. */
export const FaqPage: React.FC = () => {
  const [cat, setCat] = useState('Semua');
  const [open, setOpen] = useState<number | null>(0);

  const list = cat === 'Semua' ? FAQS : FAQS.filter((f) => f.cat === cat);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider">
          <Icon name="help" className="w-3.5 h-3.5" />
          FAQ
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.035em] text-ink">
          Pertanyaan Umum
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Temukan jawaban cepat, atau hubungi CS WhatsApp kami pada pukul {BRAND.csHours}.
        </p>
      </div>

      <section className="mt-9 rounded-2xl border border-line bg-white p-5 sm:p-7">
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
                  className="w-full min-h-[44px] px-4 py-3 text-left flex items-center justify-between gap-4 hover:bg-surface transition-colors cursor-pointer"
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

      <p className="mt-8 text-center text-xs text-muted">
        Belum ketemu jawabannya?{' '}
        <Link href="/hubungi-kami" className="font-semibold text-accent hover:underline">
          Hubungi kami
        </Link>
        .
      </p>
    </div>
  );
};
