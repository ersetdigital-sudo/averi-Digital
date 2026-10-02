'use client';

import React from 'react';

const STEPS: { num: string; label: string; desc: string }[] = [
  { num: '01', label: 'Pilih Produk', desc: 'Tentukan layanan dan nominalnya.' },
  { num: '02', label: 'Masukkan Nomor', desc: 'Isi nomor tujuan atau ID pelanggan.' },
  { num: '03', label: 'Lakukan Pembayaran', desc: 'Bayar praktis memakai QRIS.' },
  { num: '04', label: 'Cek Pesanan', desc: 'Pantau status, SN, atau token.' },
];

/** Timeline 4 langkah cara transaksi. */
export const StepsTimeline: React.FC = () => (
  <section className="bg-surface border-y border-line py-14" id="cara-transaksi">
    <div className="shell">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-[34px] font-extrabold tracking-tight text-ink">
          Cara Transaksi
        </h2>
        <p className="mt-2 text-sm text-muted">
          Empat langkah singkat dari pilih produk sampai pesanan selesai.
        </p>
      </div>

      <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-5">
        {/* Garis penghubung (desktop) */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute left-[26px] right-[26px] top-[26px] h-0.5 bg-line"
        />

        {STEPS.map((s, i) => (
          <li
            key={s.num}
            className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3.5"
          >
            <span
              className={`w-[52px] h-[52px] shrink-0 rounded-xl border-[1.5px] grid place-items-center font-extrabold text-base relative z-10 num-tabular ${
                i === 0
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white border-line text-ink'
              }`}
            >
              {s.num}
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">{s.label}</h3>
              <p className="text-[13px] text-muted mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);