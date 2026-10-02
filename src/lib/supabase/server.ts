import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase admin client (service role). HANYA untuk server.
 * Dipakai karena tabel `orders` sengaja tidak bisa dibaca anon (berisi nomor
 * tujuan, serial, dan token pelanggan).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi.');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Supabase client yang membaca sesi login dari cookie (untuk server component). */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi.');
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari server component (read-only) — aman diabaikan.
        }
      },
    },
  });
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
}

/**
 * Ambil user admin yang sedang login.
 * Wajib dicek di setiap server action admin.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await createAdminClient()
      .from('admin_users')
      .select('user_id, email, full_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!data) return null;

    return {
      id: String(data.user_id),
      email: String(data.email ?? user.email ?? ''),
      fullName: String(data.full_name ?? 'Administrator'),
    };
  } catch {
    return null;
  }
}

/** Cek apakah user terdaftar sebagai admin (tanpa memuat profilenya). */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}
