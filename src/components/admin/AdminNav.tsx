'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '../Icon';

export const ADMIN_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Dashboard', icon: 'home' },
  { href: '/admin/produk', label: 'Produk', icon: 'price_check' },
  { href: '/admin/kategori', label: 'Kategori', icon: 'book' },
  { href: '/admin/pesanan', label: 'Pesanan', icon: 'receipt_long' },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: 'settings' },
];

export function isAdminLinkActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Menu sidebar admin.
 *
 * `rail`  — sidebar tablet: ikon saja, label muncul dari breakpoint xl.
 * `drawer`— sidebar mobile: label selalu tampil.
 */
export const AdminNav: React.FC<{ variant?: 'rail' | 'drawer'; onNavigate?: () => void }> = ({
  variant = 'drawer',
  onNavigate,
}) => {
  const pathname = usePathname();
  const rail = variant === 'rail';

  return (
    <nav className="flex flex-col gap-1" aria-label="Navigasi panel admin">
      {ADMIN_LINKS.map((link) => {
        const active = isAdminLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            title={rail ? link.label : undefined}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[44px] items-center gap-3 rounded-xl text-sm font-semibold transition-colors ${
              rail ? 'justify-center px-2 xl:justify-start xl:px-3' : 'px-3'
            } ${
              active
                ? 'bg-accent-soft font-bold text-accent'
                : 'text-ink-soft hover:bg-surface hover:text-ink'
            }`}
          >
            <Icon name={link.icon} className="h-[18px] w-[18px] shrink-0" />
            <span className={rail ? 'hidden truncate xl:block' : 'truncate'}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
