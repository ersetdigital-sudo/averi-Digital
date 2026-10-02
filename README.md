# Averi Digital

Lokapasar isi ulang & pembayaran tagihan (PPOB) dengan pengalaman **wizard 4 langkah**.
Dibangun dengan **Next.js (App Router)**, React 19, TypeScript, dan Tailwind CSS v4.

> Proyek ini **berdiri sendiri** (proyek terpisah), bukan bagian dari repo Fortiva Shop,
> meskipun memakai stack & domain PPOB yang sama. Tampilan, warna, dan struktur
> halamannya sengaja dibuat berbeda.

## Palet Warna

Terinspirasi palet Domino's (biru / merah / putih):

| Nama | Hex | Peran |
| --- | --- | --- |
| Ocean | `#006491` | Aksen utama: tombol aksi/harga, pill kategori aktif, **ikon sukses** |
| Cherry | `#E31837` | Highlight: badge, kartu promo merah, elips kartu gelap, tombol sekunder |
| Deep Blue | `#013C5B` | Ink: judul, tombol gelap, elemen QR, footer, kartu gelap |
| Mist | `#F3F6F8` | Surface / band section (nuansa kebiruan) |

Token didefinisikan di `src/index.css` (`--color-accent`, `--color-gold`, `--color-ink`, dst.)
sehingga dipakai sebagai utility Tailwind: `bg-accent`, `bg-gold`, `text-ink`, `border-line`.

## Menjalankan Secara Lokal

**Prasyarat:** Node.js 20.9+ (disarankan 22/24)

1. Install dependency:
   `npm install`
2. Jalankan development server (port **3010**):
   `npm run dev`
3. Buka [http://localhost:3010](http://localhost:3010)

## Scripts

| Script              | Keterangan                              |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Dev server di port 3010                 |
| `npm run build`     | Build produksi (Next.js)                |
| `npm run start`     | Menjalankan hasil build produksi        |
| `npm run typecheck` | Cek tipe TypeScript (`tsc --noEmit`)    |

## Struktur

```
src/
  app/              # Route Next.js (tipis: Suspense + force-dynamic)
  checkout/         # useCheckout.ts (logika murni) + CheckoutWidget.tsx (UI /checkout)
  components/       # UI (lihat daftar seksi di bawah)
    steps/          # Konten tiap langkah checkout (murni presentasional)
  views/            # Isi halaman per-route (HomePage, CekPesananPage, ...)
  data/catalog.ts   # Katalog layanan/provider/nominal + PRODUCTS + validator tujuan
  lib/config.ts     # Brand, jam CS, URL WhatsApp, format rupiah
  lib/orderStore.ts # Penyimpanan pesanan lokal + verifikasi invoice
  index.css         # Tailwind v4 + token tema (hijau hutan/amber/midnight/mist)
  types.ts          # Tipe domain
```

## Struktur Halaman Beranda (`/`)

Beranda bersifat **jajual (browse) saja** — tidak ada lagi wizard di dalamnya.
Checkout dipindah ke halaman terpisah `/checkout` supaya alur tidak terasa berat.

1. **Hero / Quick Transaction** — `components/Hero.tsx`
   Kolom kiri: eyebrow, headline, search bar, chip populer. Kolom kanan: kartu katalog gelap.
2. **Promo Mosaic** — `components/PromoMosaic.tsx` — 3 kartu (hijau besar, amber, midnight)
3. **Marketplace** — `components/ProductMarketplace.tsx`
   sidebar kiri sticky (pencarian, **kategori ringkas** Semua + 5 layanan, sort) + grid 3 kolom
4. **Keunggulan** — 3 kartu (tanpa biaya admin, nomor aman, bantuan cepat)
5. **Cara Transaksi** — `components/StepsTimeline.tsx` — timeline 4 langkah
6. **Band Bantuan** — `components/SupportBand.tsx` — midnight + border amber

Header (`TopNav.tsx`) = utility bar midnight + header sticky dengan search bar & tombol WhatsApp CS.
Footer (`SiteFooter.tsx`) = 4 kolom bertema midnight.

### Halaman Checkout (`/checkout`)

`app/checkout/page.tsx` (client) merender `checkout/CheckoutWidget.tsx`, yang memakai
`checkout/useCheckout.ts` untuk seluruh state & logika (pisah rapi: hook tanpa JSX).

Query string dipakai untuk **prefill** pilihan (langsung berlaku saat render pertama):

| Parameter | Contoh | Arti |
| --- | --- | --- |
| `service` | `?service=pln` | Layanan terpilih |
| `prov` | `&prov=pln-prabayar` | Provider terkunci |
| `nom` | `&nom=pln100` | Nominal terkunci |

Semua tombol di beranda (chip hero, "Beli" di katalog, tombol promo, footer)**
mengrahkan ke `/checkout` dengan parameter di atas — tidak ada state wizard
yang tertinggal di beranda.

### 8 Kategori (di langkah 1 halaman `/checkout`)

`steps/StepCategory.tsx` menampilkan **8 kategori layanan** — 4 kategori tagihan
dipecah per jenis (PDAM, BPJS, Internet, Multifinance) tapi tetap map ke layanan
`tagihan` dengan `providerId` berbeda:

| Kategori | `service` | `providerId` |
| --- | --- | --- |
| Pulsa Reguler | `pulsa` | (otomatis / deteksi operator) |
| Paket Data | `data` | (otomatis / deteksi operator) |
| Token Listrik PLN | `pln` | `pln-prabayar` |
| Top Up E-Wallet | `ewallet` | `gopay` |
| Tagihan PDAM | `tagihan` | `pdam` |
| BPJS Kesehatan | `tagihan` | `bpjs` |
| Tagihan Internet | `tagihan` | `indihome` |
| Multifinance | `tagihan` | `multifinance` |

## Alur Wizard

`Layanan` → `Nomor Tujuan` → `Nominal` → `Konfirmasi` → `Bayar QRIS` → `Sukses`

Riwayat transaksi disimpan lokal di `localStorage` (key `_averi_orders`) dan bisa
diverifikasi di halaman **Cek Pesanan** memakai kombinasi nomor invoice + nomor tujuan.