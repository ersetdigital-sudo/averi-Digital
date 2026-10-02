/**
 * Konfigurasi brand & kontak Topupin.
 * Bisa di-override lewat env publik (lihat `.env.example`) tanpa ubah source.
 */
export const BRAND = {
  name: 'Topupin',
  tagline: 'Isi ulang & bayar tagihan, sekali klik.',
  merchant: process.env.NEXT_PUBLIC_MERCHANT_NAME || 'TOPUPIN DIGITAL',
  csWhatsapp: process.env.NEXT_PUBLIC_CS_WHATSAPP || '6281234567890',
  csHours: '08.00 – 22.00 WIB',
} as const;

/** Bangun tautan WhatsApp CS dengan pesan siap kirim. */
export function waLink(message: string): string {
  return `https://wa.me/${BRAND.csWhatsapp}?text=${encodeURIComponent(message)}`;
}

/** Format angka menjadi rupiah, mis. 25750 -> "Rp25.750". */
export function rupiah(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`;
}