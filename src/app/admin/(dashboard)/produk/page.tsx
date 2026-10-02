import { Suspense } from 'react';
import { ProductsManager } from '@/components/admin/ProductsManager';
import {
  getCategories,
  getCategoriesAdmin,
  getProducts,
  getProvidersAdmin,
  resolveViews,
} from '@/lib/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produk · Panel Admin Averi Digital' };

export default async function Page() {
  const [categories, providers, products, allCategories] = await Promise.all([
    getCategoriesAdmin(),
    getProvidersAdmin(),
    getProducts({ activeOnly: false }),
    getCategories(false),
  ]);

  return (
    <Suspense fallback={null}>
      <ProductsManager
        categories={categories}
        providers={providers}
        products={resolveViews(products, allCategories, providers)}
      />
    </Suspense>
  );
}
