import { Suspense } from 'react';
import { KatalogPage } from '../../views/KatalogPage';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Katalog Produk · Averi Digital' };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <KatalogPage />
    </Suspense>
  );
}
