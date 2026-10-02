'use server';

import { createAdminClient } from '@/lib/supabase/server';
import {
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  type PublicSettings,
} from '@/lib/public-settings';

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
