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

/** Menu sidebar admin. `onNavigate` menutup drawer di mobile. */
export const AdminNav: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Navigasi panel admin">
      {ADMIN_LINKS.map((link) => {
        const active = isAdminLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors ${
              active ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface hover:text-ink'
            }`}
          >
            <Icon name={link.icon} className="h-[18px] w-[18px] shrink-0" />
            <span className="whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
