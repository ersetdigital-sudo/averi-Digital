'use client';

import React, { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase/client';
import { Icon } from '../Icon';

/**
 * Form login admin — satu akun saja, jadi email tidak perlu diketik.
 * Bisa diubah lewat NEXT_PUBLIC_ADMIN_EMAIL tanpa menyentuh kode.
 */
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@averidigital.id';

/** Field admin memakai token brand storefront (lihat `src/index.css`). */
const FIELD =
  'w-full min-h-[48px] rounded-xl border-[1.5px] border-line bg-white px-4 pr-12 text-sm text-ink outline-none transition focus:border-accent placeholder:text-muted';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/admin/verifikasi';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Tempel dikerjakan manual supaya tetap jalan walau browser/ekstensi
   * memblokir paste bawaan: teks disisipkan di posisi kursor.
   */
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!pasted) return;

    event.preventDefault();
    const input = event.currentTarget;
    const start = input.selectionStart ?? password.length;
    const end = input.selectionEnd ?? password.length;
    const text = pasted.replace(/\s+/g, '');
    const next = password.slice(0, start) + text + password.slice(end);

    setPassword(next);
    requestAnimationFrame(() => {
      const caret = start + text.length;
      input.setSelectionRange(caret, caret);
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error: signInError } = await supabaseBrowser().auth.signInWithPassword({
        email: ADMIN_EMAIL,
        // Spasi/baris baru dari hasil salin-tempel dibuang agar tidak gagal.
        password: password.replace(/\s+/g, ''),
      });

      if (signInError) {
        setError(
          signInError.message === 'Invalid login credentials'
            ? 'Kata sandi salah.'
            : signInError.message
        );
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full space-y-4">
      <div className="w-full">
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-xs font-bold text-ink"
        >
          Kata Sandi
        </label>
        <div className="relative w-full">
          <input
            ref={inputRef}
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus
            required
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onPaste={handlePaste}
            placeholder="Masukkan kata sandi admin"
            className={FIELD}
          />
          <button
            type="button"
            onClick={() => {
              setShowPassword((prev) => !prev);
              inputRef.current?.focus();
            }}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink cursor-pointer"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
          Tempel (Ctrl+V) atau ketik kata sandi, lalu tekan Masuk.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-xs font-medium text-gold"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60 cursor-pointer"
      >
        {submitting ? 'Memproses…' : 'Masuk ke Panel Admin'}
      </button>
    </form>
  );
};
