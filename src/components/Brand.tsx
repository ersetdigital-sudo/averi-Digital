'use client';

import React from 'react';

interface WordmarkProps {
  /** Tinggi mark (px); ukuran teks mengikuti. */
  height?: number;
  className?: string;
  /** Versi untuk latar gelap (teks putih, aksen kuning). */
  light?: boolean;
}

/**
 * Logo Topupin — mark squircle aksen dengan panah naik (simbol "top up"),
 * ditambah wordmark tegas.
 */
export const Wordmark: React.FC<WordmarkProps> = ({ height = 30, className, light }) => {
  const fontSize = Math.round(height * 0.56);
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <svg
        width={height}
        height={height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Topupin"
        className="shrink-0"
      >
        <rect x="2" y="2" width="36" height="36" rx="12" fill="#013c5b" />
        <path
          d="M20 29V13M20 13l-6 6M20 13l6 6"
          stroke="#e31837"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="30.5" cy="10.5" r="2.4" fill="#ffffff" />
      </svg>
      <span
        className={`font-extrabold tracking-tight leading-none ${light ? 'text-white' : 'text-ink'}`}
        style={{ fontSize }}
      >
        Top<span className={light ? 'text-gold' : 'text-accent'}>upin</span>
      </span>
    </span>
  );
};