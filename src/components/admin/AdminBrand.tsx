import React from 'react';

/**
 * Identitas visual area admin: mark Averi Digital (lingkaran gradasi biru +
 * puncak "A") dan lockup "Averi Digital Admin".
 *
 * Warna memakai token brand storefront (lihat `src/index.css`) supaya area
 * admin satu identitas dengan situs pelanggan.
 */
export const ADMIN_BRAND = {
  name: 'Averi Digital',
  /** Ditampilkan sebagai judul utama di layar login. */
  title: 'Panel Admin Averi Digital',
  subtitle: 'Masuk untuk mengelola produk, pesanan, dan pengaturan toko.',
} as const;

/** Mark Averi Digital saja (senada dengan favicon `src/app/icon.svg`). */
export const AveriMark: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={ADMIN_BRAND.name}
    className={`shrink-0 ${className ?? ''}`}
  >
    <defs>
      <linearGradient
        id="averi-mark-gradient"
        x1="6"
        y1="5"
        x2="42"
        y2="43"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1596C9" />
        <stop offset="0.5" stopColor="#006491" />
        <stop offset="1" stopColor="#013C5B" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="21.8" stroke="url(#averi-mark-gradient)" strokeWidth="3.2" />
    <circle cx="24" cy="24" r="15" fill="url(#averi-mark-gradient)" />
    <path
      d="M24 14.4 16.7 34.2M24 14.4l7.3 19.8"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle cx="38.4" cy="10.6" r="5" fill="#E31837" stroke="#ffffff" strokeWidth="2.3" />
  </svg>
);
