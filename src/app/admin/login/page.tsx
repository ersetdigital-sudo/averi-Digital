import { Suspense } from 'react';
import { LoginForm } from '../../../components/admin/LoginForm';
import { Mark } from '../../../components/Brand';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Masuk Admin · Averi Digital' };

export default function Page() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Mark height={44} />
          <h1 className="mt-4 text-lg font-extrabold tracking-display text-ink">Panel Admin</h1>
          <p className="mt-1 text-xs text-muted">
            Masuk untuk memverifikasi pembayaran dan memproses pesanan.
          </p>
        </div>

        <Suspense
          fallback={<div className="h-40 animate-pulse rounded-xl bg-surface" aria-hidden="true" />}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
