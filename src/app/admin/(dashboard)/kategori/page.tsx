import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { getCategoriesAdmin, getProvidersAdmin, getProductCountsByCategory } from '@/lib/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Kategori · Panel Admin Averi Digital' };

export default async function Page() {
  const [categories, providers, counts] = await Promise.all([
    getCategoriesAdmin(),
    getProvidersAdmin(),
    getProductCountsByCategory(),
  ]);

  return <CategoriesManager categories={categories} providers={providers} counts={counts} />;
}
