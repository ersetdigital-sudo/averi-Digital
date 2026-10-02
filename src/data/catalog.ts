import { ServiceId, ServiceMeta, Provider, Nominal, CatalogProduct } from '../types';
import { IconName } from '../components/Icon';

/** Meta tiap layanan: nama, label input tujuan, dan aturan validasi digit. */
export const SERVICE_META: Record<ServiceId, ServiceMeta> = {
  pulsa: {
    id: 'pulsa',
    name: 'Pulsa Reguler',
    short: 'Pulsa',
    blurb: 'Isi ulang pulsa semua operator',
    destLabel: 'Nomor handphone',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Pastikan nomor aktif untuk menerima SMS konfirmasi.',
    minDigits: 9,
    maxDigits: 13,
  },
  data: {
    id: 'data',
    name: 'Paket Data',
    short: 'Paket Data',
    blurb: 'Kuota internet harian & bulanan',
    destLabel: 'Nomor handphone',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Kuota aktif otomatis setelah pembayaran terverifikasi.',
    minDigits: 9,
    maxDigits: 13,
  },
  pln: {
    id: 'pln',
    name: 'Token Listrik PLN',
    short: 'Token PLN',
    blurb: 'Token prabayar 20 digit',
    destLabel: 'Nomor meter / ID pelanggan',
    destPlaceholder: '14xxxxxxxxxx',
    destHint: 'Struk 20 digit akan tampil setelah pembayaran selesai.',
    minDigits: 11,
    maxDigits: 12,
  },
  ewallet: {
    id: 'ewallet',
    name: 'Top Up E-Wallet',
    short: 'E-Wallet',
    blurb: 'Saldo GoPay, DANA, OVO & lainnya',
    destLabel: 'Nomor ponsel akun e-wallet',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Saldo masuk penuh tanpa potongan biaya admin.',
    minDigits: 9,
    maxDigits: 13,
  },
  tagihan: {
    id: 'tagihan',
    name: 'Tagihan Rutin',
    short: 'Tagihan',
    blurb: 'BPJS, PDAM, internet & cicilan',
    destLabel: 'Nomor pelanggan / ID tagihan',
    destPlaceholder: 'Masukkan ID tagihan',
    destHint: 'Periksa kembali nama pelanggan sebelum membayar.',
    minDigits: 6,
    maxDigits: 16,
  },
};

/** Urutan tampil di langkah 1 (Layanan). */
export const SERVICES: { id: ServiceId; icon: IconName }[] = [
  { id: 'pulsa', icon: 'call' },
  { id: 'data', icon: 'wifi' },
  { id: 'pln', icon: 'bolt' },
  { id: 'ewallet', icon: 'wallet' },
  { id: 'tagihan', icon: 'receipt' },
];

const TELCO: Provider[] = [
  { id: 'telkomsel', name: 'Telkomsel', code: 'TSEL', swatch: '#e11d48' },
  { id: 'indosat', name: 'Indosat', code: 'ISAT', swatch: '#f59e0b' },
  { id: 'xl', name: 'XL Axiata', code: 'XL', swatch: '#2563eb' },
  { id: 'tri', name: 'Tri', code: 'TRI', swatch: '#8a2a3a' },
  { id: 'smartfren', name: 'Smartfren', code: 'SF', swatch: '#db2777' },
];

export const PROVIDERS: Record<ServiceId, Provider[]> = {
  pulsa: [...TELCO],
  data: [...TELCO],
  pln: [
    { id: 'pln-prabayar', name: 'PLN Prabayar', code: 'PRA', swatch: '#ea580c' },
    { id: 'pln-pascabayar', name: 'PLN Pascabayar', code: 'PASCA', swatch: '#3d566a' },
  ],
  ewallet: [
    { id: 'gopay', name: 'GoPay', code: 'GOPAY', swatch: '#06b6d4' },
    { id: 'dana', name: 'DANA', code: 'DANA', swatch: '#0ea5e9' },
    { id: 'ovo', name: 'OVO', code: 'OVO', swatch: '#7c3aed' },
    { id: 'shopeepay', name: 'ShopeePay', code: 'SPAY', swatch: '#f97316' },
    { id: 'linkaja', name: 'LinkAja', code: 'LINK', swatch: '#ef4444' },
  ],
  tagihan: [
    { id: 'bpjs', name: 'BPJS Kesehatan', code: 'BPJS', swatch: '#059669' },
    { id: 'pdam', name: 'PDAM', code: 'PDAM', swatch: '#0284c7' },
    { id: 'indihome', name: 'IndiHome', code: 'INDI', swatch: '#dc2626' },
    { id: 'multifinance', name: 'Multifinance', code: 'FIN', swatch: '#475569' },
  ],
};

export const NOMINALS: Record<ServiceId, Nominal[]> = {
  pulsa: [
    { id: 'p10', label: '10.000', note: 'Aktif +7 hari', price: 11000 },
    { id: 'p25', label: '25.000', note: 'Aktif +30 hari', price: 25750, tag: 'POPULER' },
    { id: 'p50', label: '50.000', note: 'Aktif +45 hari', price: 50500 },
    { id: 'p100', label: '100.000', note: 'Aktif +60 hari', price: 99500, tag: 'HEMAT' },
  ],
  data: [
    { id: 'd3', label: '3 GB', note: 'Berlaku 30 hari', price: 18500 },
    { id: 'd10', label: '10 GB', note: 'Berlaku 30 hari', price: 45000, tag: 'POPULER' },
    { id: 'd25', label: '25 GB', note: 'Berlaku 30 hari', price: 79000 },
    { id: 'd50', label: '50 GB', note: 'Termasuk streaming', price: 125000, tag: 'HEMAT' },
  ],
  pln: [
    { id: 'pln20', label: '20.000', note: '≈ 13,5 kWh', price: 22500 },
    { id: 'pln100', label: '100.000', note: '≈ 69,2 kWh', price: 102500, tag: 'POPULER' },
    { id: 'pln200', label: '200.000', note: '≈ 138 kWh', price: 202500 },
    { id: 'pln500', label: '500.000', note: '≈ 348 kWh', price: 502500, tag: 'HEMAT' },
  ],
  ewallet: [
    { id: 'ew20', label: '20.000', note: 'Masuk penuh', price: 20500 },
    { id: 'ew50', label: '50.000', note: 'Masuk penuh', price: 50500, tag: 'POPULER' },
    { id: 'ew100', label: '100.000', note: 'Masuk penuh', price: 100500 },
    { id: 'ew200', label: '200.000', note: 'Masuk penuh', price: 200500, tag: 'HEMAT' },
  ],
  tagihan: [
    { id: 'tag-cek', label: 'Cek & Bayar', note: 'Inquiry realtime', price: 75000, tag: 'POPULER' },
    { id: 'tag-1', label: 'Tagihan 1 bulan', note: 'Periode berjalan', price: 125000 },
    { id: 'tag-2', label: 'Tagihan 2 bulan', note: 'Periode akumulatif', price: 250000 },
  ],
};

/** Deteksi operator dari prefix nomor (khusus Pulsa & Paket Data). */
export function detectOperator(phone: string): string {
  const n = phone.replace(/\D/g, '');
  if (n.length < 4) return 'Telkomsel';
  if (/^08(11|12|13|21|22|23|51|52|53)/.test(n)) return 'Telkomsel';
  if (/^08(14|15|16|55|56|57|58)/.test(n)) return 'Indosat';
  if (/^08(17|18|19|59|77|78)/.test(n)) return 'XL Axiata';
  if (/^08(95|96|97|98|99)/.test(n)) return 'Tri';
  if (/^08(81|82|83|84|85|86|87|88|89)/.test(n)) return 'Smartfren';
  return 'Telkomsel';
}

/** Validasi nomor tujuan. Mengembalikan pesan error atau null bila valid. */
export function validateDestination(service: ServiceId, value: string): string | null {
  const clean = value.replace(/\D/g, '');
  const meta = SERVICE_META[service];

  if (!clean) return `${meta.destLabel} belum diisi.`;

  if (service === 'pulsa' || service === 'data' || service === 'ewallet') {
    if (!clean.startsWith('08')) return 'Nomor HP harus diawali 08.';
    if (clean.length < 9 || clean.length > 13) return 'Nomor HP tidak valid (9–13 digit).';
    return null;
  }

  if (clean.length < meta.minDigits) {
    return `${meta.destLabel} minimal ${meta.minDigits} digit.`;
  }
  if (clean.length > meta.maxDigits) {
    return `${meta.destLabel} maksimal ${meta.maxDigits} digit.`;
  }
  return null;
}

/**
 * Katalog produk untuk grid marketplace. Tiap entri hanya merujuk
 * `providerId` + `nominalId` yang sudah ada, jadi harga & label selalu
 * sinkron dengan katalog wizard (single source of truth).
 */
export const PRODUCTS: CatalogProduct[] = [
  // --- Pulsa ---
  { id: 'prd-tsel-25', service: 'pulsa', providerId: 'telkomsel', nominalId: 'p25', name: 'Pulsa Reguler', desc: 'Masa aktif bertambah otomatis.', badge: 'POPULER', popularity: 10 },
  { id: 'prd-isat-50', service: 'pulsa', providerId: 'indosat', nominalId: 'p50', name: 'Pulsa Reguler', desc: 'Pengisian langsung ke nomor.', popularity: 8 },
  { id: 'prd-xl-10', service: 'pulsa', providerId: 'xl', nominalId: 'p10', name: 'Pulsa Reguler', desc: 'Berlaku untuk semua kartu XL.', popularity: 6 },
  { id: 'prd-tri-25', service: 'pulsa', providerId: 'tri', nominalId: 'p25', name: 'Pulsa Reguler', desc: 'Cocok untuk isi ulang cepat.', popularity: 5 },
  { id: 'prd-sf-50', service: 'pulsa', providerId: 'smartfren', nominalId: 'p50', name: 'Pulsa Reguler', desc: 'Pengisian otomatis 24 jam.', popularity: 4 },
  // --- Paket Data ---
  { id: 'prd-tsel-d10', service: 'data', providerId: 'telkomsel', nominalId: 'd10', name: 'Paket Data 10 GB', desc: 'Kuota utama 24 jam, 30 hari.', badge: 'HEMAT', popularity: 9 },
  { id: 'prd-xl-d25', service: 'data', providerId: 'xl', nominalId: 'd25', name: 'Xtra Combo 25 GB', desc: 'Kuota utama + kuota aplikasi.', popularity: 7 },
  { id: 'prd-isat-d3', service: 'data', providerId: 'indosat', nominalId: 'd3', name: 'Paket Data 3 GB', desc: 'Reguler untuk semua jaringan.', popularity: 5 },
  { id: 'prd-sf-d50', service: 'data', providerId: 'smartfren', nominalId: 'd50', name: 'Paket Data 50 GB', desc: 'Termasuk langganan streaming.', popularity: 4 },
  // --- PLN ---
  { id: 'prd-pln-100', service: 'pln', providerId: 'pln-prabayar', nominalId: 'pln100', name: 'Token Listrik', desc: 'Token prabayar langsung terkirim.', badge: 'POPULER', popularity: 10 },
  { id: 'prd-pln-200', service: 'pln', providerId: 'pln-prabayar', nominalId: 'pln200', name: 'Token Listrik', desc: 'Token prabayar langsung terkirim.', popularity: 7 },
  { id: 'prd-pln-20', service: 'pln', providerId: 'pln-prabayar', nominalId: 'pln20', name: 'Token Listrik', desc: 'Nominal kecil untuk pemakaian ringan.', popularity: 5 },
  { id: 'prd-pln-pasca', service: 'pln', providerId: 'pln-pascabayar', nominalId: 'pln100', name: 'Tagihan Pascabayar', desc: 'Pembayaran tagihan listrik bulanan.', popularity: 6 },
  // --- E-Wallet ---
  { id: 'prd-dana-50', service: 'ewallet', providerId: 'dana', nominalId: 'ew50', name: 'Saldo DANA', desc: 'Top up saldo ke akun terdaftar.', badge: 'POPULER', popularity: 9 },
  { id: 'prd-gopay-100', service: 'ewallet', providerId: 'gopay', nominalId: 'ew100', name: 'Saldo GoPay', desc: 'Masuk penuh tanpa potongan.', popularity: 7 },
  { id: 'prd-ovo-20', service: 'ewallet', providerId: 'ovo', nominalId: 'ew20', name: 'Saldo OVO', desc: 'Top up saldo ke akun terdaftar.', popularity: 5 },
  // --- Tagihan (tiap kategori punya minimal 2 produk) ---
  { id: 'prd-pdam', service: 'tagihan', providerId: 'pdam', nominalId: 'tag-1', name: 'Tagihan Air PDAM', desc: 'Pembayaran tagihan air bulanan.', badge: 'POPULER', popularity: 6 },
  { id: 'prd-pdam-2', service: 'tagihan', providerId: 'pdam', nominalId: 'tag-2', name: 'Tagihan Air PDAM', desc: 'Bayar dua periode sekaligus.', popularity: 4 },
  { id: 'prd-bpjs', service: 'tagihan', providerId: 'bpjs', nominalId: 'tag-1', name: 'Iuran BPJS Kesehatan', desc: 'Pembayaran iuran per keluarga.', badge: 'POPULER', popularity: 7 },
  { id: 'prd-bpjs-2', service: 'tagihan', providerId: 'bpjs', nominalId: 'tag-2', name: 'Iuran BPJS Kesehatan', desc: 'Iuran dua bulan berjalan.', popularity: 5 },
  { id: 'prd-indihome', service: 'tagihan', providerId: 'indihome', nominalId: 'tag-1', name: 'Tagihan Internet Rumah', desc: 'Pembayaran IndiHome bulanan.', popularity: 6 },
  { id: 'prd-indihome-cek', service: 'tagihan', providerId: 'indihome', nominalId: 'tag-cek', name: 'Cek Tagihan Internet', desc: 'Inquiry realtime sebelum bayar.', popularity: 4 },
  { id: 'prd-fin', service: 'tagihan', providerId: 'multifinance', nominalId: 'tag-1', name: 'Angsuran Multifinance', desc: 'Pembayaran cicilan kendaraan.', popularity: 5 },
  { id: 'prd-fin-2', service: 'tagihan', providerId: 'multifinance', nominalId: 'tag-2', name: 'Angsuran Multifinance', desc: 'Cicilan dua periode akumulatif.', popularity: 3 },
];

/** Ambil data tampilan (nama provider, warna, label nominal, harga) dari sebuah produk. */
export function resolveProduct(p: CatalogProduct): {
  providerName: string;
  providerSwatch: string;
  nominalLabel: string;
  price: number;
  serviceShort: string;
} {
  const provider =
    PROVIDERS[p.service].find((x) => x.id === p.providerId) || PROVIDERS[p.service][0];
  const nominal =
    NOMINALS[p.service].find((x) => x.id === p.nominalId) || NOMINALS[p.service][0];
  return {
    providerName: provider.name,
    providerSwatch: provider.swatch,
    nominalLabel: nominal.label,
    price: nominal.price,
    serviceShort: SERVICE_META[p.service].short,
  };
}