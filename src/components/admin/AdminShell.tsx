'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AveriAdminLockup } from './AdminBrand';
import { AdminNav, ADMIN_LINKS, isAdminLinkActive } from './AdminNav';
import { LogoutButton } from './LogoutButton';
import { Icon } from '../Icon';

interface AdminShellProps {
  email: string;
  fullName: string;
  children: React.ReactNode;
}

/**
 * Kerangka panel admin (khusus admin — tidak memakai navbar/footer storefront).
 *
 * Desktop : sidebar tetap di kiri + header + area konten.
 * Mobile  : header dengan hamburger; sidebar jadi drawer dari kiri + overlay.
 */
export const AdminShell: React.FC<AdminShellProps> = ({ email, fullName, children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup drawer setiap kali pindah halaman.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Kunci scroll body saat drawer terbuka + tutup dengan tombol Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeLabel =
    ADMIN_LINKS.find((link) => isAdminLinkActive(pathname, link.href))?.label ?? 'Panel Admin';

  const sidebarBody = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-4">
        <Link href="/admin" onClick={onNavigate} aria-label="Dashboard admin">
          <AveriAdminLockup size={30} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNav onNavigate={onNavigate} />
      </div>

      <div className="border-t border-line px-4 py-3">
        <p className="truncate text-xs font-semibold text-ink">{fullName}</p>
        <p className="truncate text-[11px] text-muted">{email}</p>
        <div className="mt-2.5">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white lg:block">
        {sidebarBody()}
      </aside>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[264px] max-w-[85vw] border-r border-line bg-white transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu panel admin"
        aria-hidden={!open}
      >
        {sidebarBody(() => setOpen(false))}
      </aside>

      {/* Konten */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-[1.5px] border-line text-ink lg:hidden cursor-pointer"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold tracking-[-0.02em] text-ink sm:text-lg">
              {activeLabel}
            </h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="ml-auto hidden items-center gap-1.5 rounded-lg border-[1.5px] border-line px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            Lihat Storefront
            <Icon name="arrow_right" className="h-3.5 w-3.5" />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1120px] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};
