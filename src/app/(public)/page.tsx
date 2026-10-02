import { Suspense } from 'react';
import { HomePage } from '@/views/HomePage';
import { getStorefrontCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { categories, products } = await getStorefrontCatalog();

  return (
    <Suspense fallback={null}>
      <HomePage categories={categories} products={products} />
    </Suspense>
  );
}
