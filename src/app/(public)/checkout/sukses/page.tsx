import { Suspense } from 'react';
import { SuccessPage } from '@/views/SuccessPage';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Transaksi Berhasil · Averi Digital' };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SuccessPage />
    </Suspense>
  );
}
