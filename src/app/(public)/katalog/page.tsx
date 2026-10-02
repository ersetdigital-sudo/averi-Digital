import { Suspense } from 'react';
import { KatalogPage } from '@/views/KatalogPage';
import { getStorefrontCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Katalog Produk · Averi Digital' };

export default async function Page() {
  const { categories, products } = await getStorefrontCatalog();

  return (
    <Suspense fallback={null}>
      <KatalogPage categories={categories} products={products} />
    </Suspense>
  );
}
