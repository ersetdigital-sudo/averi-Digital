'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../components/Icon';
import { BRAND, waLink } from '../lib/config';

/** Halaman /hubungi-kami — kontak CS & bantuan cepat. */
export const ContactPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <div className="text-center">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider">
        <Icon name="support_agent" className="w-3.5 h-3.5" />
        Dukungan
      </span>
      <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-[-0.035em] text-ink">
        Hubungi Kami
      </h1>
      <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl mx-auto">
        Tim CS siap membantu setiap hari pukul {BRAND.csHours} lewat WhatsApp.
      </p>
    </div>

    <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a
        href={waLink(`Halo CS ${BRAND.name}, saya butuh bantuan.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-2xl border border-line bg-white p-5 flex items-start gap-4 hover:border-accent transition-colors"
      >
        <span className="w-10 h-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <Icon name="whatsapp" className="w-5 h-5" />
        </span>
        <span>
          <span className="block text-sm font-bold text-ink">Chat CS WhatsApp</span>
          <span className="block text-xs text-muted mt-1">
            Respon rata-rata 1–3 menit pada jam operasional ({BRAND.csHours}).
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
            Lihat status, serial number, atau token secara mandiri.
          </span>
        </span>
      </Link>
    </div>

    {/* Panduan cepat */}
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-base font-extrabold text-ink">Sebelum menghubungi CS</h2>
      <ul className="mt-4 space-y-2.5">
        {[
          'Siapkan nomor invoice transaksimu (format AVD-2026-XXXXX).',
          'Cek status mandiri lewat halaman Cek Pesanan.',
          'Untuk kendala pembayaran, baca Panduan Pembayaran QRIS.',
        ].map((t) => (
          <li key={t} className="flex gap-2.5 text-xs text-ink-soft leading-relaxed">
            <Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-accent shrink-0" strokeWidth={3} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link
          href="/panduan-pembayaran"
          className="flex-1 min-h-[44px] rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="book" className="w-4 h-4" />
          Panduan Pembayaran
        </Link>
        <Link
          href="/faq"
          className="flex-1 min-h-[44px] rounded-xl border border-line text-ink-soft hover:bg-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Icon name="help" className="w-4 h-4" />
          Lihat FAQ
        </Link>
      </div>
    </section>
  </div>
);
