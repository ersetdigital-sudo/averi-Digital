'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client untuk browser (sesi admin disimpan di cookie agar
 * middleware di `src/proxy.ts` bisa membacanya).
 */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi.'
    );
  }

  return createBrowserClient(url, anonKey);
}
