'use client';

import React, { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabase/client';
import { Icon } from '../Icon';

export const LogoutButton: React.FC<{ className?: string }> = ({ className }) => {
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await supabaseBrowser().auth.signOut();
    } catch {
      // Sesi mungkin sudah tidak valid — tetap arahkan ke halaman login.
    }
    // Navigasi penuh supaya cookie sesi benar-benar dibuang dari semua tab.
    window.location.assign('/admin/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-gold disabled:opacity-60 cursor-pointer ${
        className ?? ''
      }`}
    >
      <Icon name="logout" className="h-4 w-4" />
      {busy ? 'Keluar…' : 'Keluar'}
    </button>
  );
};
