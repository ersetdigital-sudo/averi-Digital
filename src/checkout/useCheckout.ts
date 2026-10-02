import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order, ProductView } from '../types';
import {
  findProductByLegacyParams,
  findProductBySlug,
  resolveProductView,
  validateDestination,
} from '../data/catalog';
import { buildInvoiceAndSerial, saveOrder } from '../lib/orderStore';

/**
 * Alur checkout baru (tanpa wizard):
 *   Produk → Detail (/produk/[slug]) → Checkout (form ini) →
 *   QRIS (/pembayaran/[invoice]) → Status → Sukses (/checkout/sukses).
 *
 * Hook murni tanpa JSX — dipakai `views/CheckoutPage.tsx`.
 */
export function useCheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /** Produk terpilih dari ?product=<slug> (dikirim dari halaman detail produk). */
  const product: ProductView | null = useMemo(() => {
    const slug = searchParams.get('product');
    if (slug) {
      const found = findProductBySlug(slug);
      return found ? resolveProductView(found) : null;
    }
    // Format lama: ?service=<kategori>&prov=<provider>&nom=<nominal>
    const legacy = findProductByLegacyParams(
      searchParams.get('service'),
      searchParams.get('prov'),
      searchParams.get('nom')
    );
    return legacy ? resolveProductView(legacy) : null;
  }, [searchParams]);

  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDestination = (value: string) => {
    setDestination(value);
    setError(null);
  };

  /** Validasi → simpan pesanan PENDING → arahkan ke halaman pembayaran QRIS. */
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const err = validateDestination(product.category, destination);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const { invoice, serial } = buildInvoiceAndSerial(now);
      const order: Order = {
        id: `ord-${Date.now()}`,
        productSlug: product.slug,
        invoice,
        serial,
        serviceName: product.name,
        providerName: product.providerName,
        nominalLabel: product.nominalLabel,
        destination,
        total: product.price,
        status: 'PENDING',
        createdAt: `Hari ini, ${pad(now.getHours())}:${pad(now.getMinutes())} WIB`,
      };
      await saveOrder(order);
      router.push(`/pembayaran/${invoice}`);
    } finally {
      setSubmitting(false);
    }
  };

  return { product, destination, error, submitting, handleDestination, submit };
}
