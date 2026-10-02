import { ProductDetailPage } from '@/views/ProductDetailPage';
import { getProductViewBySlug } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductViewBySlug(slug);
  return { title: product ? `${product.name} · Averi Digital` : 'Detail Produk · Averi Digital' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductViewBySlug(slug);
  return <ProductDetailPage product={product} />;
}
