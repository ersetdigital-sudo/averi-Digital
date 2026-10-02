import { BRAND, QRIS } from './config';

/**
 * Setelan publik yang dibaca dari tabel `settings` (Supabase).
 *
 * Semua nilai punya cadangan dari `src/lib/config.ts`, jadi situs tetap jalan
 * walau env / baris setelan belum diisi. Mengganti gambar QRIS atau nomor CS
 * cukup lewat UPDATE di tabel `settings` — tanpa deploy ulang.
 *
 * File ini TIDAK boleh diberi `'use server'`: modul server action hanya boleh
 * mengekspor fungsi async, sehingga tipe & nilai bersama ditaruh di sini.
 */
export interface PublicSettings {
  siteName: string;
  tagline: string;
  qrisImageUrl: string;
  qrisMerchant: string;
  whatsappCs: string;
  csHours: string;
}

export const DEFAULT_SETTINGS: PublicSettings = {
  siteName: BRAND.name,
  tagline: BRAND.tagline,
  qrisImageUrl: QRIS.imageUrl,
  qrisMerchant: QRIS.merchant,
  whatsappCs: BRAND.csWhatsapp,
  csHours: BRAND.csHours,
};

/** Kunci setelan di tabel `settings` -> nama field yang dipakai UI. */
export const SETTING_KEYS: Record<string, keyof PublicSettings> = {
  site_name: 'siteName',
  site_tagline: 'tagline',
  qris_image_url: 'qrisImageUrl',
  qris_merchant: 'qrisMerchant',
  whatsapp_cs: 'whatsappCs',
  cs_hours: 'csHours',
};
