import { IconName } from './components/Icon';

/** 8 kategori produk utama — urutan wajib sesuai requirements. */
export type CategoryId =
  | 'pulsa'
  | 'data'
  | 'ewallet'
  | 'pln'
  | 'internet'
  | 'bpjs'
  | 'multifinance'
  | 'pdam';

export type NominalTag = 'POPULER' | 'HEMAT' | 'PROMO';

export interface Provider {
  id: string;
  name: string;
  code: string;
  /** Warna chip provider (hex). */
  swatch: string;
}

export interface Nominal {
  id: string;
  label: string;
  note: string;
  price: number;
  tag?: NominalTag;
}

export interface CategoryMeta {
  id: CategoryId;
  /** Nama resmi kategori, mis. "Pembayaran Internet" (JANGAN diganti generik). */
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
}

export interface Product {
  id: string;
  /** Slug untuk halaman /produk/[slug], unik. */
  slug: string;
  category: CategoryId;
  providerId: string;
  nominalId: string;
  name: string;
  desc: string;
  /** Harga override (utk kategori tagihan: nilai tagihan nyata per provider). */
  priceOverride?: number;
  badge?: NominalTag;
  /** Skor popularitas untuk sorting "Terpopuler". */
  popularity: number;
}

export interface ProductView extends Product {
  categoryName: string;
  categoryIcon: IconName;
  isBill: boolean;
  providerName: string;
  providerSwatch: string;
  nominalLabel: string;
  nominalNote: string;
  price: number;
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
