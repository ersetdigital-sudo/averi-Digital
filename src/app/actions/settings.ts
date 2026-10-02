'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, getAdminUser } from '@/lib/supabase/server';
import {
  DEFAULT_SETTINGS,
  EDITABLE_KEYS,
  SETTING_KEYS,
  type PublicSettings,
  type SettingRow,
} from '@/lib/public-settings';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const DENIED = 'Akses ditolak. Silakan masuk sebagai admin.';

/** Baca setelan publik dari Supabase, dengan cadangan dari `src/lib/config.ts`. */
export async function fetchPublicSettings(): Promise<PublicSettings> {
  try {
    const { data, error } = await createAdminClient().from('settings').select('key, value');
    if (error || !data) return DEFAULT_SETTINGS;

    const result: PublicSettings = { ...DEFAULT_SETTINGS };

    for (const row of data as { key: string; value: string | null }[]) {
      const field = SETTING_KEYS[String(row.key)];
      // Baris kosong tidak boleh menimpa cadangan dari config.
      const value = String(row.value ?? '').trim();
      if (field && value) result[field] = value;
    }

    return result;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Semua baris setelan mentah — hanya untuk panel admin. */
export async function fetchAllSettings(): Promise<SettingRow[]> {
  if (!(await getAdminUser())) return [];

  try {
    const { data, error } = await createAdminClient()
      .from('settings')
      .select('key, value, label, group_name, sort_order')
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return (data as Record<string, unknown>[]).map((row) => ({
      key: String(row.key),
      value: String(row.value ?? ''),
      label: String(row.label ?? ''),
      groupName: String(row.group_name ?? 'umum'),
      sortOrder: Number(row.sort_order ?? 0),
    }));
  } catch {
    return [];
  }
}

/**
 * Simpan setelan dari panel admin.
 *
 * Hanya kunci yang ada di `EDITABLE_KEYS` yang diterima, supaya form tidak bisa
 * dipakai menulis kunci sembarangan.
 */
export async function saveSettings(
  entries: { key: string; value: string }[]
): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const payload = entries
    .filter((entry) => EDITABLE_KEYS.includes(entry.key))
    .map((entry) => {
      let value = String(entry.value ?? '').trim();

      // Nomor WhatsApp selalu disimpan sebagai digit saja:
      // "0812-3456" -> "628123456" (format internasional tanpa +).
      if (entry.key === 'whatsapp_cs') {
        value = value.replace(/\D/g, '');
        if (value.startsWith('0')) value = `62${value.slice(1)}`;
        else if (value.startsWith('8')) value = `62${value}`;
      }

      return { key: entry.key, value, updated_at: new Date().toISOString() };
    });

  if (payload.length === 0) {
    return { ok: false, error: 'Tidak ada perubahan yang bisa disimpan.' };
  }

  // Wajib-diisi hanya dicek untuk field yang benar-benar dikirim form, supaya
  // penyimpanan sebagian (mis. hanya nomor CS) tidak ikut ditolak.
  const values = new Map(payload.map((row) => [row.key, row.value]));
  if (values.has('qris_merchant') && !values.get('qris_merchant')) {
    return { ok: false, error: 'Nama merchant QRIS wajib diisi.' };
  }
  if (values.has('whatsapp_cs') && !values.get('whatsapp_cs')) {
    return { ok: false, error: 'Nomor WhatsApp CS wajib diisi.' };
  }

  try {
    const { error } = await createAdminClient().from('settings').upsert(payload, {
      onConflict: 'key',
    });

    if (error) return { ok: false, error: error.message };

    // Halaman yang menampilkan setelan ini.
    revalidatePath('/admin/pengaturan');
    revalidatePath('/admin/verifikasi');
    revalidatePath('/pembayaran/[invoice]', 'page');
    revalidatePath('/');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Gagal menyimpan setelan.',
    };
  }
}
