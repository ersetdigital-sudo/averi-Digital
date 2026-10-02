export type ServiceId = 'pulsa' | 'data' | 'pln' | 'ewallet' | 'tagihan';

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

export interface ServiceMeta {
  id: ServiceId;
  /** Nama panjang, mis. "Pulsa Reguler". */
  name: string;
  /** Nama pendek untuk chip/tab, mis. "Pulsa". */
  short: string;
  /** Kalimat singkat di kartu pilihan. */
  blurb: string;
  destLabel: string;
  destPlaceholder: string;
  destHint: string;
  /** Jumlah digit minimal/maksimum untuk validasi (0 = tanpa batas ketat). */
  minDigits: number;
  maxDigits: number;
}

export interface CatalogProduct {
  id: string;
  /** Layanan terkait (untuk filter & preselect wizard). */
  service: ServiceId;
  /** Provider yang dipilih saat "Beli" diklik. */
  providerId: string;
  /** Nominal yang dipilih saat "Beli" diklik. */
  nominalId: string;
  name: string;
  desc: string;
  badge?: NominalTag;
  /** Skor popularitas untuk sorting "Terpopuler". */
  popularity: number;
}

export interface Order {
  id: string;
  invoice: string;
  serviceName: string;
  providerName: string;
  nominalLabel: string;
  destination: string;
  total: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
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
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  serial?: string;
  token?: string;
  supportLink: string;
}