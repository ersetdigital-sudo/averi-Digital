import { Suspense } from 'react';
import { CheckoutPage } from '../../views/CheckoutPage';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Checkout · Averi Digital' };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
}
