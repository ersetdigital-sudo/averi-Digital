/**
 * Konfigurasi brand & kontak Averi Digital.
 * Bisa di-override lewat env publik (lihat `.env.example`) tanpa ubah source.
 */
export const BRAND = {
  name: 'Averi Digital',
  tagline: 'Isi ulang & bayar tagihan, sekali klik.',
  merchant: process.env.NEXT_PUBLIC_MERCHANT_NAME || 'AVERI DIGITAL',
  csWhatsapp: process.env.NEXT_PUBLIC_CS_WHATSAPP || '6281234567890',
  csHours: '08.00 – 22.00 WIB',
} as const;

/**
 * Konfigurasi QRIS — gambar QRIS WAJIB bisa diganti tanpa sentuh UI:
 * 1. Set env `NEXT_PUBLIC_QRIS_IMAGE_URL` saat deploy (Vercel env / .env), ATAU
 * 2. Ganti file default `public/qris.svg` (base44: /public/qris.svg).
 * UI selalu menampilkan gambar dari sini — tidak ada QR yang di-hardcode.
 */
export const QRIS = {
  imageUrl: process.env.NEXT_PUBLIC_QRIS_IMAGE_URL || '/qris.svg',
  merchant: process.env.NEXT_PUBLIC_MERCHANT_NAME || 'AVERI DIGITAL',
  method: 'QRIS Standar Nasional',
  /** Masa berlaku kode QRIS tampil (menit) di halaman pembayaran. */
  ttlMinutes: 15,
} as const;

/** Bangun tautan WhatsApp CS dengan pesan siap kirim. */
export function waLink(message: string): string {
  return `https://wa.me/${BRAND.csWhatsapp}?text=${encodeURIComponent(message)}`;
}

/** Format angka menjadi rupiah, mis. 25750 -> "Rp25.750". */
export function rupiah(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`;
}