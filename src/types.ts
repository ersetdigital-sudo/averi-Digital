import { IconName } from './components/Icon';

/**
 * Slug kategori. Nilai awalnya 8 kategori storefront, tetapi sekarang berasal
 * dari tabel `categories` di Supabase sehingga bertipe bebas (string).
 */
export type CategoryId = string;

export type NominalTag = 'POPULER' | 'HEMAT' | 'PROMO';

/** Provider/operator (baris tabel `providers`). */
export interface Provider {
  id: string;
  /** Slug provider, unik per kategori. */
  slug: string;
  name: string;
  code: string;
  /** Warna chip provider (hex). */
  swatch: string;
}

/** Meta kategori (baris tabel `categories`) — dipakai UI storefront. */
export interface CategoryMeta {
  id: string;
  /** Nama resmi kategori, mis. "Pembayaran Internet". */
  name: string;
  short: string;
  blurb: string;
  icon: IconName;
  /** Awalan nama produk, mis. "Pulsa" -> "Pulsa 25.000". */
  productPrefix: string;
  /** true = kategori tagihan (nominal bukan harga tetap per satuan produk). */
  isBill: boolean;
  destLabel: string;
  destPlaceholder: string;
  destHint: string;
  /** true = input nomor HP (08...) */
  phoneInput: boolean;
  minDigits: number;
  maxDigits: number;
  sortOrder: number;
  isActive: boolean;
}

/** Produk (baris tabel `products`). */
export interface Product {
  id: string;
  /** Slug untuk halaman /produk/[slug], unik. */
  slug: string;
  /** Slug kategori. */
  category: string;
  /** Slug provider. */
  providerId: string;
  name: string;
  sku?: string;
  desc: string;
  nominalLabel: string;
  nominalNote: string;
  /** Harga jual. */
  price: number;
  /** Harga modal/dasar. */
  costPrice: number;
  badge?: NominalTag;
  /** Skor popularitas untuk sorting "Terpopuler". */
  popularity: number;
  sortOrder: number;
  isActive: boolean;
}

/** Product + data tampilan yang sudah di-resolve (kategori & provider). */
export interface ProductView extends Product {
  categoryName: string;
  categoryIcon: IconName;
  isBill: boolean;
  providerName: string;
  providerSwatch: string;
  destLabel: string;
  destPlaceholder: string;
  phoneInput: boolean;
  minDigits: number;
  maxDigits: number;
}

/**
 * Status siklus hidup transaksi. "Saya Sudah Bayar" dari user TIDAK pernah
 * langsung menjadi SUCCESS — hanya admin verifikasi yang bisa memproses.
 */
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_VERIFICATION'
  | 'VERIFIED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED';

export interface Order {
  id: string;
  /** Slug produk sumber (untuk deteksi kategori, mis. token PLN). */
  productSlug?: string;
  invoice: string;
  serviceName: string;
  providerName: string;
  nominalLabel: string;
  destination: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  serial?: string;
  token?: string;
}

export interface VerifiedOrder {
  invoice: string;
  serviceName: string;
  providerName: string;
  nominalLabel: string;
  maskedDestination: string;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  serial?: string;
  token?: string;
  supportLink: string;
}
