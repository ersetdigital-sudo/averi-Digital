'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSettings } from '../../app/actions/settings';
import type { SettingGroup } from '../../lib/public-settings';
import { ImageUploader } from './ImageUploader';
import { Icon } from '../Icon';

interface SettingsFormProps {
  groups: SettingGroup[];
  /** Nilai awal dari tabel `settings`, di-key berdasarkan nama field. */
  initial: Record<string, string>;
}

const inputClass =
  'w-full min-h-[44px] rounded-xl border-[1.5px] border-line bg-white px-3.5 text-sm text-ink outline-none transition focus:border-accent placeholder:text-muted';

export const SettingsForm: React.FC<SettingsFormProps> = ({ groups, initial }) => {
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const group of groups) {
      for (const field of group.fields) seed[field.key] = initial[field.key] ?? '';
    }
    return seed;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(
    () => Object.keys(values).some((key) => (values[key] ?? '') !== (initial[key] ?? '')),
    [values, initial]
  );

  const qrisMissing = !values.qris_image_url?.trim();

  const update = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const result = await saveSettings(
        Object.entries(values).map(([key, value]) => ({ key, value }))
      );

      if (!result.ok) {
        setError(result.error ?? 'Gagal menyimpan setelan.');
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 pb-24">
      {qrisMissing && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold-soft/60 p-4"
        >
          <span className="mt-0.5 shrink-0 text-gold">
            <Icon name="alert" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Gambar QRIS belum diunggah</p>
            <p className="mt-1 text-xs text-ink-soft leading-relaxed">
              Pembeli saat ini melihat QR contoh yang tidak bisa dibayar. Unggah gambar QRIS
              merchant-mu di bagian di bawah, lalu tekan Simpan.
            </p>
          </div>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.id} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-sm font-extrabold tracking-[-0.01em] text-ink">{group.title}</h2>
          <p className="mt-1 mb-5 max-w-[70ch] text-xs text-muted leading-relaxed">
            {group.description}
          </p>

          <div className="space-y-5">
            {group.fields.map((field) => {
              const value = values[field.key] ?? '';

              if (field.type === 'image') {
                return (
                  <div key={field.key}>
                    <ImageUploader
                      value={value}
                      onChange={(url) => update(field.key, url)}
                      folder="averi/qris"
                      label={field.label}
                      hint={field.hint}
                    />
                  </div>
                );
              }

              return (
                <div key={field.key}>
                  <label
                    htmlFor={`setting-${field.key}`}
                    className="mb-1.5 flex items-baseline gap-1.5 text-xs font-bold text-ink"
                  >
                    {field.label}
                    {field.required && <span className="text-gold">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={`setting-${field.key}`}
                      rows={3}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => update(field.key, event.target.value)}
                      className={`${inputClass} min-h-[84px] resize-y py-2.5`}
                    />
                  ) : (
                    <input
                      id={`setting-${field.key}`}
                      type="text"
                      inputMode={field.type === 'tel' ? 'tel' : undefined}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => update(field.key, event.target.value)}
                      className={inputClass}
                    />
                  )}

                  {field.hint && (
                    <p className="mt-1.5 text-[11px] text-muted leading-relaxed">{field.hint}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Bilah simpan — menempel di bawah supaya tidak perlu scroll jauh */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="text-xs text-muted">
            {error ? (
              <span className="font-semibold text-gold">{error}</span>
            ) : saved ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
                <Icon name="check" className="h-4 w-4" /> Setelan tersimpan.
              </span>
            ) : dirty ? (
              'Ada perubahan yang belum disimpan.'
            ) : (
              'Belum ada perubahan.'
            )}
          </p>

          <button
            type="submit"
            disabled={saving || !dirty}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-50 cursor-pointer"
          >
            <Icon name="save" className="h-4 w-4" />
            {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </form>
  );
};
