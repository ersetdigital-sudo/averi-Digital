'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AveriMark } from './AdminBrand';
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
 * Desktop  (>=1280px) : sidebar tetap 240px + header + konten max-width 1200px.
 * Tablet   (>=768px)  : sidebar menjadi rail ikon 64px.
 * Mobile   (<768px)   : header + drawer dari kiri + overlay.
 */
export const AdminShell: React.FC<AdminShellProps> = ({ email, fullName, children }) => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup semua panel setiap kali pindah halaman.
  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Kunci scroll body saat drawer terbuka + tutup dengan Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  const activeLabel =
    ADMIN_LINKS.find((link) => isAdminLinkActive(pathname, link.href))?.label ?? 'Panel Admin';
  const initial = (fullName || email || 'A').trim().charAt(0).toUpperCase();

  const profile = (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
        {initial}
      </span>
      <span className="hidden min-w-0 xl:block">
        <span className="block truncate text-xs font-bold text-ink">{fullName}</span>
        <span className="block truncate text-[11px] text-muted">{email}</span>
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar desktop (rail di tablet, penuh di xl) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-line/70 bg-white md:flex xl:w-60">
        <div className="flex h-16 items-center justify-center border-b border-line/70 px-3 xl:justify-start xl:px-5">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Dashboard admin">
            <AveriMark size={28} />
            <span className="hidden text-sm font-extrabold tracking-[-0.02em] text-ink xl:block">
              Averi Digital
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 xl:px-3">
          <AdminNav variant="rail" />
        </div>

        <div className="border-t border-line/70 p-3">{profile}</div>
      </aside>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity md:hidden ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] max-w-[85vw] flex-col border-r border-line/70 bg-white transition-transform duration-200 md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu panel admin"
        aria-hidden={!drawerOpen}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-line/70 px-4">
          <Link
            href="/admin"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2.5"
          >
            <AveriMark size={28} />
            <span className="text-sm font-extrabold tracking-[-0.02em] text-ink">Averi Digital</span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface cursor-pointer"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNav variant="drawer" onNavigate={() => setDrawerOpen(false)} />
        </div>

        <div className="border-t border-line/70 px-4 py-3">
          <p className="truncate text-xs font-bold text-ink">{fullName}</p>
          <p className="truncate text-[11px] text-muted">{email}</p>
          <div className="mt-2.5">
            <LogoutButton className="w-full justify-start" />
          </div>
        </div>
      </aside>

      {/* Konten */}
      <div className="md:pl-16 xl:pl-60">
        <header className="sticky top-0 z-20 border-b border-line/70 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu"
              aria-expanded={drawerOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line/70 text-ink transition-colors hover:bg-surface md:hidden cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:block">
                Admin
              </p>
              <h1 className="truncate text-sm font-extrabold tracking-[-0.02em] text-ink sm:text-base">
                {activeLabel}
              </h1>
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden min-h-[40px] shrink-0 items-center gap-2 rounded-xl border border-line/70 px-3.5 text-xs font-bold text-ink transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              Lihat Storefront
              <Icon name="arrow_right" className="h-3.5 w-3.5" />
            </Link>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu akun"
                aria-expanded={menuOpen}
                className="grid h-9 w-9 place-items-center rounded-full border border-accent/20 bg-accent-soft text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white cursor-pointer"
              >
                {initial}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-line/70 bg-white shadow-raised">
                    <div className="border-b border-line/70 px-4 py-3">
                      <p className="truncate text-xs font-bold text-ink">{fullName}</p>
                      <p className="truncate text-[11px] text-muted">{email}</p>
                    </div>
                    <div className="p-1.5">
                      <LogoutButton className="w-full justify-start" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
