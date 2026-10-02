import React from 'react';
import Link from 'next/link';
import { Icon, type IconName } from '../../Icon';

interface QuickActionProps {
  href: string;
  label: string;
  icon: IconName;
  /** Aksi utama memakai brand fill. */
  primary?: boolean;
}

/** Tombol aksi cepat yang ringkas (bukan kartu besar). */
export const QuickAction: React.FC<QuickActionProps> = ({ href, label, icon, primary }) => (
  <Link
    href={href}
    className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors sm:flex-none ${
      primary
        ? 'bg-accent text-white hover:bg-accent-dark'
        : 'border border-line/70 bg-white text-ink hover:border-accent hover:text-accent'
    }`}
  >
    <Icon name={icon} className="h-4 w-4 shrink-0" />
    <span className="whitespace-nowrap">{label}</span>
  </Link>
);
