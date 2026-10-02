import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';
import { ADMIN_BRAND, AveriMark } from '@/components/admin/AdminBrand';

export const dynamic = 'force-dynamic';

/**
 * Kartu login admin. Kerangka layar penuhnya ada di `./layout.tsx`.
 * Tidak ada navbar, footer, maupun tautan storefront di halaman ini.
 */
export default function Page() {
  return (
    <div className="w-full rounded-2xl border border-line bg-white p-6 shadow-[0_18px_50px_-24px_rgba(1,60,91,0.28)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <AveriMark size={56} />
        <h1 className="mt-5 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-2xl">
          {ADMIN_BRAND.title}
        </h1>
        <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-muted">
          {ADMIN_BRAND.subtitle}
        </p>
      </div>

      <div className="mt-7 w-full">
        <Suspense
          fallback={
            <div className="h-44 w-full animate-pulse rounded-xl bg-surface" aria-hidden="true" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-center text-[11px] leading-relaxed text-muted">
        Area terbatas — halaman ini hanya untuk administrator.
      </p>
    </div>
  );
}
