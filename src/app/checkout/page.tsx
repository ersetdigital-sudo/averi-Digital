'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutWidget } from '../../checkout/CheckoutWidget';
import { Icon } from '../../components/Icon';

export const dynamic = 'force-dynamic';

export default function Page() {
  const router = useRouter();
  const goHome = () => router.push('/');
  return (
    <Suspense fallback={null}>
      <div className="shell pt-8">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors cursor-pointer"
        >
          <Icon name="chevron_left" className="w-3.5 h-3.5" />
          Kembali ke beranda
        </button>

        <div className="mt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">Checkout</h1>
          <p className="mt-2 text-sm text-muted">
            Selesaikan transaksi dalam empat langkah: layanan, nomor tujuan, nominal, konfirmasi.
          </p>
        </div>
      </div>

      <div className="shell">
        <CheckoutWidget onExit={goHome} homeLabel="Kembali ke Beranda" />
      </div>
    </Suspense>
  );
}