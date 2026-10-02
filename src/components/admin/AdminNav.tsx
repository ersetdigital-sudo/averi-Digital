'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '../Icon';

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin/verifikasi', label: 'Pesanan', icon: 'receipt_long' },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: 'settings' },
];

export const AdminNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1.5 overflow-x-auto no-scrollbar lg:flex-col lg:gap-1 lg:overflow-visible">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-xl px-3.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-accent text-white'
                : 'text-ink-soft hover:bg-surface hover:text-ink'
            }`}
          >
            <Icon name={link.icon} className="h-4.5 w-4.5 shrink-0" />
            <span className="whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
