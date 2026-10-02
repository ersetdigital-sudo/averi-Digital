import React from 'react';

/**
 * Identitas visual area admin: mark Averi Digital (squircle merah + bolt) dan
 * lockup "Averi Digital Admin".
 *
 * Palet sengaja memakai warna brand Averi Digital langsung (bukan token
 * storefront) supaya area admin tidak tercampur dengan identitas pelanggan.
 * Ubah satu konstanta di bawah kalau nama panelnya berganti.
 */
export const ADMIN_BRAND = {
  name: 'Averi Digital',
  /** Ditampilkan sebagai judul utama di layar login. */
  title: 'Panel Admin Averi Digital',
  subtitle: 'Masuk untuk mengelola produk, pesanan, dan pengaturan toko.',
  lockupSuffix: 'Admin',
} as const;

const RED = '#F2352B';
const NAVY = '#111827';
const YELLOW = '#FFE78F';

/** Mark Averi Digital saja. */
export const AveriMark: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={ADMIN_BRAND.name}
    className={`shrink-0 ${className ?? ''}`}
  >
    <rect x="2" y="2" width="36" height="36" rx="11" fill={RED} />
    <path d="M24.5 6.5 L13 22.2 L19.6 22.2 L15.5 33.5 L27 17.8 L20.4 17.8 Z" fill="#FFFFFF" />
    <circle cx="10.8" cy="29.2" r="2" fill={YELLOW} />
  </svg>
);

/** Mark + wordmark, untuk header/sidebar. */
export const AveriAdminLockup: React.FC<{ size?: number; className?: string }> = ({
  size = 30,
  className,
}) => (
  <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
    <AveriMark size={size} />
    <span
      className="font-extrabold leading-none tracking-[-0.02em]"
      style={{ fontSize: Math.round(size * 0.5), color: NAVY }}
    >
      {ADMIN_BRAND.name}
      <span className="font-bold" style={{ color: RED }}>
        {ADMIN_BRAND.lockupSuffix}
      </span>
    </span>
  </span>
);
