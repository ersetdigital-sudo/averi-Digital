import { Suspense } from 'react';
import { CheckoutPage } from '@/views/CheckoutPage';
import { getProductViewBySlug, getProductViewByLegacy } from '@/lib/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Checkout · Averi Digital' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (key: string) => {
    const value = sp[key];
    return typeof value === 'string' ? value : null;
  };

  const slug = pick('product');
  const product = slug
    ? await getProductViewBySlug(slug)
    : await getProductViewByLegacy(pick('service'), pick('prov'), pick('nom'));

  return (
    <Suspense fallback={null}>
      <CheckoutPage product={product} />
    </Suspense>
  );
}
