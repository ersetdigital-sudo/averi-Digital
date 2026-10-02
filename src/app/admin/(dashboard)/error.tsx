'use client';

import { Icon } from '@/components/Icon';

/** Error state panel admin — jelas dan ringkas, tidak menutupi navigasi. */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-6 text-center shadow-card sm:p-10">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-gold">
        <Icon name="alert" className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-base font-extrabold tracking-[-0.02em] text-ink">
        Gagal memuat data dashboard.
      </h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-xs text-muted">
        Koneksi ke backend terputus atau sesi berakhir. Muat ulang untuk mencoba lagi.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 text-xs font-bold text-white transition-colors hover:bg-accent-dark"
      >
        <Icon name="refresh" className="h-3.5 w-3.5" />
        Muat Ulang
      </button>
    </div>
  );
}
