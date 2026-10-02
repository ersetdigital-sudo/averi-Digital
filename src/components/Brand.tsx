'use client';

import React, { useId } from 'react';

interface WordmarkProps {
  /** Tinggi mark (px); ukuran teks mengikuti. */
  height?: number;
  className?: string;
  /** Versi untuk latar gelap (teks putih, aksen lebih terang). */
  light?: boolean;
}

/**
 * Logo Averi Digital — mark berupa piringan bergradasi ocean di dalam cincin
 * tipis, dengan monogram "A" putih dan titik cherry di sudut kanan atas yang
 * terbaca seperti lencana notifikasi.
 */
export const Wordmark: React.FC<WordmarkProps> = ({ height = 30, className, light }) => {
  const fontSize = Math.round(height * 0.56);
  // Hindari bentrok id gradien saat logo tampil lebih dari sekali di satu halaman.
  const gradientId = `averi-mark-${useId().replace(/[:]/g, '')}`;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <Mark height={height} gradientId={gradientId} />
      <span
        className={`font-extrabold leading-none tracking-[-0.02em] ${
          light ? 'text-white' : 'text-ink'
        }`}
        style={{ fontSize }}
      >
        Averi
        <span className={`font-bold ${light ? 'text-accent-soft' : 'text-accent'}`}> Digital</span>
      </span>
    </span>
  );
};

/** Mark saja — dipakai juga untuk favicon (`src/app/icon.svg`). */
export const Mark: React.FC<{ height?: number; gradientId?: string }> = ({
  height = 30,
  gradientId,
}) => {
  const id = gradientId ?? 'averi-mark-static';

  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Averi Digital"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={id} x1="6" y1="5" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1596C9" />
          <stop offset="0.5" stopColor="#006491" />
          <stop offset="1" stopColor="#013C5B" />
        </linearGradient>
      </defs>

      {/* Cincin tipis di luar piringan */}
      <circle cx="24" cy="24" r="21.8" stroke={`url(#${id})`} strokeWidth="3.2" />

      {/* Piringan penuh bergradasi */}
      <circle cx="24" cy="24" r="15" fill={`url(#${id})`} />

      {/* Monogram A */}
      <path
        d="M24 14.4 16.7 34.2M24 14.4l7.3 19.8"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Titik cherry — lencana notifikasi */}
      <circle cx="38.4" cy="10.6" r="5" fill="#E31837" stroke="#ffffff" strokeWidth="2.3" />
    </svg>
  );
};
