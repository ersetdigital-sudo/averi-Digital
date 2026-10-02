import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Order, ProductView } from '../types';
import { validateDestination } from '../lib/destination';
import { buildInvoice, saveOrder } from '../lib/orderStore';

/**
 * Alur checkout (tanpa wizard):
 *   Produk → Detail (/produk/[slug]) → Checkout (form ini) →
 *   QRIS (/pembayaran/[invoice]) → Status → Sukses (/checkout/sukses).
 *
 * Produk di-resolve di server (Supabase) lalu dikirim sebagai prop, sehingga
 * halaman checkout tidak perlu membaca katalog di browser.
 */
export function useCheckoutForm(product: ProductView | null) {
  const router = useRouter();
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

    const err = validateDestination(product, destination);
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const invoice = buildInvoice(now);
      const order: Order = {
        id: `ord-${Date.now()}`,
        productSlug: product.slug,
        invoice,
        serviceName: product.name,
        providerName: product.providerName,
        nominalLabel: product.nominalLabel,
        destination,
        total: product.price,
        status: 'PENDING_PAYMENT',
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
