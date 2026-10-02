import {
  CategoryId,
  CategoryMeta,
  Nominal,
  NominalTag,
  Product,
  ProductView,
  Provider,
} from '../types';
import { IconName } from '../components/Icon';

/**
 * KATALOG — single source of truth.
 * 8 kategori wajib, urutan tetap (JANGAN diurutkan alfabetis):
 *   Pulsa -> Paket Data -> Uang Elektronik -> PLN ->
 *   Pembayaran Internet -> BPJS -> Multifinance -> PDAM
 */
export const CATEGORY_ORDER: CategoryId[] = [
  'pulsa',
  'data',
  'ewallet',
  'pln',
  'internet',
  'bpjs',
  'multifinance',
  'pdam',
];

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  pulsa: {
    id: 'pulsa',
    name: 'Pulsa',
    short: 'Pulsa',
    blurb: 'Isi ulang pulsa semua operator',
    icon: 'call',
    productPrefix: 'Pulsa',
    isBill: false,
    destLabel: 'Nomor handphone',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Pastikan nomor aktif untuk menerima SMS konfirmasi.',
    phoneInput: true,
    minDigits: 9,
    maxDigits: 13,
  },
  data: {
    id: 'data',
    name: 'Paket Data',
    short: 'Paket Data',
    blurb: 'Kuota internet harian & bulanan',
    icon: 'wifi',
    productPrefix: 'Paket Data',
    isBill: false,
    destLabel: 'Nomor handphone',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Kuota aktif setelah pembayaran terverifikasi.',
    phoneInput: true,
    minDigits: 9,
    maxDigits: 13,
  },
  ewallet: {
    id: 'ewallet',
    name: 'Uang Elektronik',
    short: 'Uang Elektronik',
    blurb: 'Saldo DANA, GoPay, OVO & lainnya',
    icon: 'wallet',
    productPrefix: 'Saldo',
    isBill: false,
    destLabel: 'Nomor akun uang elektronik',
    destPlaceholder: '08xxxxxxxxxx',
    destHint: 'Saldo masuk penuh tanpa potongan biaya admin.',
    phoneInput: true,
    minDigits: 9,
    maxDigits: 13,
  },
  pln: {
    id: 'pln',
    name: 'PLN',
    short: 'PLN',
    blurb: 'Token listrik & tagihan pascabayar',
    icon: 'bolt',
    productPrefix: 'Token Listrik',
    isBill: false,
    destLabel: 'Nomor meter / ID pelanggan',
    destPlaceholder: '14xxxxxxxxxx',
    destHint: 'Struk token 20 digit akan tampil setelah pembayaran selesai.',
    phoneInput: false,
    minDigits: 11,
    maxDigits: 12,
  },
  internet: {
    id: 'internet',
    name: 'Pembayaran Internet',
    short: 'Pembayaran Internet',
    blurb: 'Tagihan internet rumah bulanan',
    icon: 'router',
    productPrefix: 'Pembayaran Internet',
    isBill: true,
    destLabel: 'Nomor pelanggan internet',
    destPlaceholder: 'Masukkan nomor pelanggan',
    destHint: 'Nominal mengikuti tagihan bulanan pada provider terpilih.',
    phoneInput: false,
    minDigits: 6,
    maxDigits: 16,
  },
  bpjs: {
    id: 'bpjs',
    name: 'BPJS',
    short: 'BPJS',
    blurb: 'Iuran BPJS Kesehatan bulanan',
    icon: 'health_and_safety',
    productPrefix: 'Iuran BPJS',
    isBill: true,
    destLabel: 'Nomor kartu BPJS',
    destPlaceholder: '13 digit nomor kartu',
    destHint: 'Periksa nama & jumlah anggota keluarga sebelum membayar.',
    phoneInput: false,
    minDigits: 10,
    maxDigits: 16,
  },
  multifinance: {
    id: 'multifinance',
    name: 'Multifinance',
    short: 'Multifinance',
    blurb: 'Angsuran cicilan kendaraan & lainnya',
    icon: 'payments',
    productPrefix: 'Angsuran',
    isBill: true,
    destLabel: 'Nomor kontrak',
    destPlaceholder: 'Masukkan nomor kontrak',
    destHint: 'Nominal mengikuti angsuran jatuh tempo pada kontrakmu.',
    phoneInput: false,
    minDigits: 6,
    maxDigits: 16,
  },
  pdam: {
    id: 'pdam',
    name: 'PDAM',
    short: 'PDAM',
    blurb: 'Tagihan air PDAM per wilayah',
    icon: 'water_drop',
    productPrefix: 'Tagihan Air',
    isBill: true,
    destLabel: 'Nomor pelanggan air',
    destPlaceholder: 'Masukkan nomor pelanggan',
    destHint: 'Nominal mengikuti pemakaian air bulan berjalan.',
    phoneInput: false,
    minDigits: 6,
    maxDigits: 16,
  },
};

export const CATEGORIES: CategoryMeta[] = CATEGORY_ORDER.map((id) => CATEGORY_META[id]);

const TELCO: Provider[] = [
  { id: 'telkomsel', name: 'Telkomsel', code: 'TSEL', swatch: '#e31837' },
  { id: 'indosat', name: 'Indosat', code: 'ISAT', swatch: '#006491' },
  { id: 'xl', name: 'XL Axiata', code: 'XL', swatch: '#013c5b' },
  { id: 'tri', name: 'Tri', code: 'TRI', swatch: '#3d566a' },
  { id: 'smartfren', name: 'Smartfren', code: 'SF', swatch: '#e31837' },
];

export const PROVIDERS: Record<CategoryId, Provider[]> = {
  pulsa: [...TELCO],
  data: [...TELCO],
  ewallet: [
    { id: 'dana', name: 'DANA', code: 'DANA', swatch: '#006491' },
    { id: 'gopay', name: 'GoPay', code: 'GOPAY', swatch: '#013c5b' },
    { id: 'ovo', name: 'OVO', code: 'OVO', swatch: '#3d566a' },
    { id: 'shopeepay', name: 'ShopeePay', code: 'SPAY', swatch: '#e31837' },
    { id: 'linkaja', name: 'LinkAja', code: 'LINK', swatch: '#e31837' },
  ],
  pln: [
    { id: 'pln-prabayar', name: 'PLN Prabayar', code: 'PRA', swatch: '#006491' },
    { id: 'pln-pascabayar', name: 'PLN Pascabayar', code: 'PASCA', swatch: '#013c5b' },
  ],
  internet: [
    { id: 'indihome', name: 'IndiHome', code: 'INDI', swatch: '#e31837' },
    { id: 'biznet', name: 'Biznet', code: 'BIZ', swatch: '#006491' },
    { id: 'firstmedia', name: 'First Media', code: 'FM', swatch: '#013c5b' },
    { id: 'myrepublic', name: 'MyRepublic', code: 'MR', swatch: '#3d566a' },
  ],
  bpjs: [{ id: 'bpjs-kesehatan', name: 'BPJS Kesehatan', code: 'BPJS', swatch: '#006491' }],
  multifinance: [
    { id: 'fif', name: 'FIF', code: 'FIF', swatch: '#006491' },
    { id: 'acc', name: 'ACC', code: 'ACC', swatch: '#013c5b' },
    { id: 'mpm', name: 'MPM Finance', code: 'MPM', swatch: '#3d566a' },
    { id: 'baf', name: 'BAF', code: 'BAF', swatch: '#e31837' },
  ],
  pdam: [
    { id: 'aetra', name: 'Aetra', code: 'AET', swatch: '#006491' },
    { id: 'palyja', name: 'Palyja', code: 'PLY', swatch: '#013c5b' },
    { id: 'tirta-musi', name: 'Tirta Musi', code: 'TIRT', swatch: '#3d566a' },
  ],
};

export const NOMINALS: Record<CategoryId, Nominal[]> = {
  pulsa: [
    { id: 'p5000', label: '5.000', note: 'Aktif +5 hari', price: 6500 },
    { id: 'p10000', label: '10.000', note: 'Aktif +15 hari', price: 11500 },
    { id: 'p15000', label: '15.000', note: 'Aktif +20 hari', price: 16650 },
    { id: 'p20000', label: '20.000', note: 'Aktif +25 hari', price: 21650 },
    { id: 'p25000', label: '25.000', note: 'Aktif +30 hari', price: 26500, tag: 'POPULER' },
    { id: 'p50000', label: '50.000', note: 'Aktif +45 hari', price: 51450 },
    { id: 'p100000', label: '100.000', note: 'Aktif +60 hari', price: 101450, tag: 'HEMAT' },
    { id: 'p150000', label: '150.000', note: 'Aktif +75 hari', price: 151450 },
    { id: 'p200000', label: '200.000', note: 'Aktif +90 hari', price: 201450 },
  ],
  data: [
    { id: 'd1', label: '1 GB', note: 'Berlaku 7 hari', price: 6500 },
    { id: 'd2', label: '2 GB', note: 'Berlaku 14 hari', price: 12500 },
    { id: 'd5', label: '5 GB', note: 'Berlaku 30 hari', price: 26500 },
    { id: 'd10', label: '10 GB', note: 'Berlaku 30 hari', price: 48500, tag: 'POPULER' },
    { id: 'd15', label: '15 GB', note: 'Berlaku 30 hari', price: 66500 },
    { id: 'd20', label: '20 GB', note: 'Berlaku 30 hari', price: 82500 },
    { id: 'd25', label: '25 GB', note: 'Berlaku 30 hari', price: 98500 },
    { id: 'd30', label: '30 GB', note: 'Berlaku 30 hari', price: 115500, tag: 'HEMAT' },
  ],
  ewallet: [
    { id: 'ew25', label: '25.000', note: 'Masuk penuh', price: 25500 },
    { id: 'ew50', label: '50.000', note: 'Masuk penuh', price: 50500, tag: 'POPULER' },
    { id: 'ew100', label: '100.000', note: 'Masuk penuh', price: 100500 },
    { id: 'ew150', label: '150.000', note: 'Masuk penuh', price: 150500 },
    { id: 'ew200', label: '200.000', note: 'Masuk penuh', price: 200500, tag: 'HEMAT' },
    { id: 'ew500', label: '500.000', note: 'Masuk penuh', price: 500500 },
  ],
  pln: [
    { id: 'pln20', label: '20.000', note: '≈ 13,5 kWh', price: 22500 },
    { id: 'pln50', label: '50.000', note: '≈ 34,1 kWh', price: 52500 },
    { id: 'pln100', label: '100.000', note: '≈ 69,2 kWh', price: 102500, tag: 'POPULER' },
    { id: 'pln200', label: '200.000', note: '≈ 138 kWh', price: 202500 },
    { id: 'pln500', label: '500.000', note: '≈ 348 kWh', price: 502500, tag: 'HEMAT' },
    { id: 'pln1000', label: '1.000.000', note: '≈ 698 kWh', price: 1002500 },
  ],
  internet: [
    { id: 'in1', label: '1 Bulan', note: 'Tagihan bulan berjalan', price: 350000 },
    { id: 'in2', label: '2 Bulan', note: 'Dua periode akumulatif', price: 700000 },
  ],
  bpjs: [
    { id: 'bp1', label: 'Iuran 1 Bulan', note: 'Periode berjalan', price: 150000 },
    { id: 'bp2', label: 'Iuran 2 Bulan', note: 'Dua periode akumulatif', price: 300000 },
    { id: 'bp3', label: 'Iuran 3 Bulan', note: 'Tiga periode akumulatif', price: 450000 },
  ],
  multifinance: [
    { id: 'mf1', label: '1 Angsuran', note: 'Jatuh tempo berjalan', price: 1500000 },
    { id: 'mf2', label: '2 Angsuran', note: 'Dua jatuh tempo', price: 3000000 },
  ],
  pdam: [
    { id: 'pd1', label: '1 Bulan', note: 'Pemakaian bulan berjalan', price: 87500 },
    { id: 'pd2', label: '2 Bulan', note: 'Dua periode akumulatif', price: 175000 },
  ],
};

interface ProductSeed {
  providerId: string;
  nominalIds: string[];
  desc: string;
  badge?: NominalTag;
  popularity: number;
  priceOverrides?: Record<string, number>;
}

const SEEDS: Record<CategoryId, ProductSeed[]> = {
  pulsa: [
    { providerId: 'telkomsel', nominalIds: ['p5000', 'p10000', 'p25000', 'p50000', 'p100000'], desc: 'Pengisian ke nomor kamu.', badge: 'POPULER', popularity: 10 },
    { providerId: 'indosat', nominalIds: ['p10000', 'p25000', 'p50000'], desc: 'Masa aktif bertambah.', popularity: 8 },
    { providerId: 'xl', nominalIds: ['p5000', 'p25000', 'p100000'], desc: 'Berlaku untuk semua kartu XL.', popularity: 6 },
    { providerId: 'tri', nominalIds: ['p10000', 'p25000'], desc: 'Cocok untuk isi ulang rutin.', popularity: 5 },
    { providerId: 'smartfren', nominalIds: ['p25000', 'p50000'], desc: 'Cocok untuk pemakaian harian.', popularity: 4 },
  ],
  data: [
    { providerId: 'telkomsel', nominalIds: ['d1', 'd5', 'd10', 'd25'], desc: 'Kuota utama 24 jam penuh.', badge: 'POPULER', popularity: 9 },
    { providerId: 'xl', nominalIds: ['d2', 'd10', 'd30'], desc: 'Kuota utama + kuota aplikasi.', badge: 'HEMAT', popularity: 7 },
    { providerId: 'indosat', nominalIds: ['d5', 'd15'], desc: 'Reguler untuk semua jaringan.', popularity: 5 },
    { providerId: 'tri', nominalIds: ['d10', 'd30'], desc: 'Kuota AlwaysOn 24 jam.', popularity: 4 },
  ],
  ewallet: [
    { providerId: 'dana', nominalIds: ['ew25', 'ew50', 'ew100'], desc: 'Top up saldo ke akun terdaftar.', badge: 'POPULER', popularity: 9 },
    { providerId: 'gopay', nominalIds: ['ew50', 'ew100'], desc: 'Masuk penuh tanpa potongan.', popularity: 7 },
    { providerId: 'ovo', nominalIds: ['ew50', 'ew200'], desc: 'Top up saldo OVO.', popularity: 5 },
    { providerId: 'shopeepay', nominalIds: ['ew100'], desc: 'Saldo untuk belanja & bayar.', popularity: 4 },
    { providerId: 'linkaja', nominalIds: ['ew25', 'ew50'], desc: 'Top up saldo LinkAja.', popularity: 3 },
  ],
  pln: [
    { providerId: 'pln-prabayar', nominalIds: ['pln20', 'pln50', 'pln100', 'pln200', 'pln500', 'pln1000'], desc: 'Token prabayar 20 digit.', badge: 'POPULER', popularity: 10 },
    { providerId: 'pln-pascabayar', nominalIds: ['pln100'], desc: 'Pembayaran tagihan listrik bulanan.', popularity: 6 },
  ],
  internet: [
    { providerId: 'indihome', nominalIds: ['in1', 'in2'], desc: 'Tagihan IndiHome bulanan.', badge: 'POPULER', popularity: 7, priceOverrides: { in1: 375000, in2: 750000 } },
    { providerId: 'biznet', nominalIds: ['in1'], desc: 'Tagihan Biznet Home bulanan.', popularity: 6, priceOverrides: { in1: 350000 } },
    { providerId: 'firstmedia', nominalIds: ['in1', 'in2'], desc: 'Tagihan First Media bulanan.', popularity: 5, priceOverrides: { in1: 425000, in2: 850000 } },
    { providerId: 'myrepublic', nominalIds: ['in1'], desc: 'Tagihan MyRepublic bulanan.', popularity: 4, priceOverrides: { in1: 320000 } },
  ],
  bpjs: [
    { providerId: 'bpjs-kesehatan', nominalIds: ['bp1', 'bp2', 'bp3'], desc: 'Iuran BPJS Kesehatan per keluarga.', badge: 'POPULER', popularity: 8 },
  ],
  multifinance: [
    { providerId: 'fif', nominalIds: ['mf1', 'mf2'], desc: 'Angsuran FIF jatuh tempo.', badge: 'POPULER', popularity: 6, priceOverrides: { mf1: 1250000, mf2: 2500000 } },
    { providerId: 'acc', nominalIds: ['mf1'], desc: 'Angsuran ACC jatuh tempo.', popularity: 5, priceOverrides: { mf1: 1875000 } },
    { providerId: 'mpm', nominalIds: ['mf1'], desc: 'Angsuran MPM Finance.', popularity: 4, priceOverrides: { mf1: 950000 } },
    { providerId: 'baf', nominalIds: ['mf1'], desc: 'Angsuran BAF jatuh tempo.', popularity: 4, priceOverrides: { mf1: 1650000 } },
  ],
  pdam: [
    { providerId: 'aetra', nominalIds: ['pd1', 'pd2'], desc: 'Tagihan air Aetra bulanan.', badge: 'POPULER', popularity: 5 },
    { providerId: 'palyja', nominalIds: ['pd1', 'pd2'], desc: 'Tagihan air Palyja bulanan.', popularity: 5 },
    { providerId: 'tirta-musi', nominalIds: ['pd1'], desc: 'Tagihan air Tirta Musi.', popularity: 3 },
  ],
};

function buildProducts(): Product[] {
  const list: Product[] = [];
  for (const category of CATEGORY_ORDER) {
    const meta = CATEGORY_META[category];
    for (const seed of SEEDS[category]) {
      for (const nominalId of seed.nominalIds) {
        const nominal = NOMINALS[category].find((n) => n.id === nominalId);
        if (!nominal) continue;
        list.push({
          id: `prd-${seed.providerId}-${nominalId}`,
          slug: `${seed.providerId}-${nominalId}`,
          category,
          providerId: seed.providerId,
          nominalId,
          name: `${meta.productPrefix} ${nominal.label}`,
          desc: seed.desc,
          priceOverride: seed.priceOverrides?.[nominalId],
          badge: seed.badge && nominalId === seed.nominalIds[0] ? seed.badge : undefined,
          popularity: seed.popularity,
        });
      }
    }
  }
  return list;
}

export const PRODUCTS: Product[] = buildProducts();

/** Cari produk dari parameter lama (?service=&prov=&nom=) sebelum format slug. */
export function findProductByLegacyParams(
  service: string | null,
  provider: string | null,
  nominal: string | null
): Product | null {
  if (!service || !provider) return null;
  return (
    PRODUCTS.find(
      (p) => p.category === service && p.providerId === provider && (!nominal || p.nominalId === nominal)
    ) ??
    PRODUCTS.find((p) => p.category === service && p.providerId === provider) ??
    null
  );
}

/** Cari produk berdasarkan slug /produk/[slug]. */
export function findProductBySlug(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/** Semua produk dalam satu kategori. */
export function productsByCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** N produk terpopuler (dipakai beranda). */
export function topProducts(n: number): Product[] {
  return [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, n);
}

/** Cari produk lain dari provider yang sama (variasi nominal). */
export function siblingProducts(product: Product): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.providerId === product.providerId
  );
}

/** Susun data tampilan lengkap untuk sebuah produk. */
export function resolveProductView(p: Product): ProductView {
  const meta = CATEGORY_META[p.category];
  const provider =
    PROVIDERS[p.category].find((x) => x.id === p.providerId) || PROVIDERS[p.category][0];
  const nominal =
    NOMINALS[p.category].find((x) => x.id === p.nominalId) || NOMINALS[p.category][0];
  return {
    ...p,
    categoryName: meta.name,
    categoryIcon: meta.icon,
    isBill: meta.isBill,
    providerName: provider.name,
    providerSwatch: provider.swatch,
    nominalLabel: nominal.label,
    nominalNote: nominal.note,
    price: p.priceOverride ?? nominal.price,
  };
}

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
export function validateDestination(category: CategoryId, value: string): string | null {
  const clean = value.replace(/\D/g, '');
  const meta = CATEGORY_META[category];

  if (!clean) return `${meta.destLabel} belum diisi.`;

  if (meta.phoneInput) {
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
