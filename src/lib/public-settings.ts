import { BRAND, QRIS } from './config';

/**
 * Setelan publik yang dibaca dari tabel `settings` (Supabase).
 *
 * Semua nilai punya cadangan dari `src/lib/config.ts`, jadi situs tetap jalan
 * walau env / baris setelan belum diisi. Mengganti gambar QRIS atau nomor CS
 * cukup lewat panel admin — tanpa deploy ulang.
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

/** Satu baris tabel `settings`. */
export interface SettingRow {
  key: string;
  value: string;
  label: string;
  groupName: string;
  sortOrder: number;
}

/**
 * Field yang boleh diubah dari panel admin.
 * Sengaja dikelompokkan supaya form tidak jadi satu kolom panjang.
 */
export interface EditableField {
  key: string;
  label: string;
  type: 'text' | 'tel' | 'textarea' | 'image';
  placeholder?: string;
  hint?: string;
  required?: boolean;
}

export interface SettingGroup {
  id: string;
  title: string;
  description: string;
  fields: EditableField[];
}

export const SETTING_GROUPS: SettingGroup[] = [
  {
    id: 'umum',
    title: 'Identitas Toko',
    description: 'Nama dan tagline brand yang muncul di judul halaman storefront.',
    fields: [
      { key: 'site_name', label: 'Nama situs', type: 'text', placeholder: 'Averi Digital' },
      {
        key: 'site_tagline',
        label: 'Tagline',
        type: 'text',
        placeholder: 'Isi ulang & bayar tagihan, sekali klik.',
      },
    ],
  },
  {
    id: 'kontak',
    title: 'Kontak & Dukungan',
    description: 'Nomor CS dipakai di semua tombol WhatsApp dan halaman bantuan.',
    fields: [
      {
        key: 'whatsapp_cs',
        label: 'Nomor WhatsApp CS',
        type: 'tel',
        placeholder: '62812xxxxxxx',
        required: true,
        hint: 'Format internasional tanpa +, spasi, atau tanda hubung. Contoh: 628123456789.',
      },
      {
        key: 'cs_hours',
        label: 'Jam layanan CS',
        type: 'text',
        placeholder: '08.00 – 22.00 WIB',
      },
      {
        key: 'support_email',
        label: 'Email dukungan',
        type: 'text',
        placeholder: 'halo@averidigital.id',
        hint: 'Opsional. Kosongkan bila tidak dipakai.',
      },
    ],
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran QRIS',
    description:
      'Gambar QRIS diunggah ke Cloudinary lalu langsung dipakai di halaman pembayaran. Nama merchant harus sama dengan yang terdaftar di QRIS-mu.',
    fields: [
      {
        key: 'qris_image_url',
        label: 'Gambar QRIS',
        type: 'image',
        hint: 'Selama gambar ini kosong, halaman pembayaran memakai file contoh yang TIDAK bisa dibayar.',
      },
      {
        key: 'qris_merchant',
        label: 'Nama merchant QRIS',
        type: 'text',
        placeholder: 'AVERI DIGITAL',
        required: true,
        hint: 'Muncul di halaman pembayaran dan langkah panduan scan.',
      },
      {
        key: 'payment_instructions',
        label: 'Instruksi pembayaran',
        type: 'textarea',
        placeholder: 'Scan QRIS dengan aplikasi bank atau e-wallet apa pun…',
        hint: 'Ditampilkan sebagai panduan singkat untuk pembeli.',
      },
    ],
  },
  {
    id: 'rekening',
    title: 'Rekening Bank',
    description:
      'Rekening tujuan transfer manual. Boleh dikosongkan bila pembayaran hanya lewat QRIS.',
    fields: [
      {
        key: 'bank_name',
        label: 'Nama bank',
        type: 'text',
        placeholder: 'BCA',
        hint: 'Contoh: BCA, Mandiri, BRI, BNI.',
      },
      {
        key: 'bank_account_number',
        label: 'Nomor rekening',
        type: 'tel',
        placeholder: '1234567890',
      },
      {
        key: 'bank_account_name',
        label: 'Nama pemilik rekening',
        type: 'text',
        placeholder: 'PT Averi Digital',
        hint: 'Tulis persis seperti nama di rekening.',
      },
    ],
  },
];

/** Kunci yang boleh ditulis lewat panel admin. */
export const EDITABLE_KEYS = SETTING_GROUPS.flatMap((group) =>
  group.fields.map((field) => field.key)
);
