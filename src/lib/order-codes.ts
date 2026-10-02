/**
 * Pembuat kode pesanan. Fungsi murni (tanpa I/O) sehingga aman dipakai di
 * client maupun server.
 *
 * Nomor invoice dibuat saat checkout, sedangkan serial & token HANYA dibuat
 * admin setelah pembayaran terverifikasi (lihat `src/app/actions/orders.ts`).
 */

/** Prefix invoice Averi Digital. */
export const INVOICE_PREFIX = 'AVD';

/** Nomor invoice: AVD-<tahun>-<5 digit>. */
export function buildInvoice(now: Date = new Date()): string {
  return `${INVOICE_PREFIX}-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
}

/** Serial number: YYYYMMDDHHmm + 6 digit acak. */
export function buildSerial(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${Math.floor(100000 + Math.random() * 899999)}`;
}

/** Token PLN 20 digit terformat 5 grup. */
export function buildPlnToken(): string {
  return Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join('-');
}

/** Deteksi kategori token listrik dari slug produk. */
export function isPlnProduct(productSlug?: string | null): boolean {
  return (productSlug ?? '').startsWith('pln-');
}

/** Format waktu tampilan, mis. "2 Okt 2026, 14:22 WIB". */
export function formatOrderTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
  const time = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  })
    .format(date)
    .replace('.', ':');
  return `${day}, ${time} WIB`;
}
