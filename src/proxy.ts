import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Penjaga halaman admin.
 *
 * Panel verifikasi sebelumnya bisa dibuka siapa saja (datanya masih di
 * localStorage browser sehingga tidak bocor). Sekarang pesanan tersimpan di
 * Supabase, jadi /admin wajib login.
 *
 * Cek di sini hanya memastikan ada sesi login (cepat). Keanggotaan admin yang
 * sebenarnya diverifikasi di setiap server action lewat `getAdminUser()` —
 * jadi user login yang bukan admin tetap tidak bisa membaca/mengubah pesanan.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Sudah login -> jangan tampilkan form login lagi.
  if (pathname === '/admin/login') {
    if (user) return NextResponse.redirect(new URL('/admin/verifikasi', request.url));
    return response;
  }

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
