'use client';

import React from 'react';
import { ServiceId, Provider } from '../../types';
import { PROVIDERS, SERVICE_META, detectOperator } from '../../data/catalog';
import { Icon } from '../Icon';

interface Props {
  service: ServiceId;
  provider: Provider;
  onProvider: (provider: Provider) => void;
  destination: string;
  onDestination: (value: string) => void;
  error?: string | null;
}

/** Langkah 2 — pilih provider & masukkan nomor tujuan. */
export const StepDestination: React.FC<Props> = ({
  service,
  provider,
  onProvider,
  destination,
  onDestination,
  error,
}) => {
  const meta = SERVICE_META[service];
  const providers = PROVIDERS[service];
  const isTelco = service === 'pulsa' || service === 'data';
  const digits = destination.replace(/\D/g, '');
  const detected = isTelco && digits.length >= 4 ? detectOperator(destination) : null;

  return (
    <div className="space-y-6">
      <div>
        <span className="block text-xs font-bold text-ink mb-2.5">Pilih provider</span>
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => {
            const active = p.id === provider.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onProvider(p)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'border-accent bg-accent-soft/60 text-accent'
                    : 'border-line bg-white text-ink-soft hover:border-accent/60'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.swatch }} />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="dest" className="block text-xs font-bold text-ink mb-2.5">
          {meta.destLabel}
        </label>
        <div className="relative">
          <input
            id="dest"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={destination}
            onChange={(e) => onDestination(e.target.value)}
            placeholder={meta.destPlaceholder}
            className={`w-full h-12 rounded-xl border bg-white px-4 pr-11 text-sm font-semibold text-ink num-tabular placeholder:font-normal placeholder:text-muted focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-400 focus:ring-red-100'
                : 'border-line focus:border-accent focus:ring-accent-soft'
            }`}
          />
          {destination && (
            <button
              type="button"
              onClick={() => onDestination('')}
              aria-label="Hapus nomor"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-muted hover:text-ink flex items-center justify-center cursor-pointer"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>

        {error ? (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
            <Icon name="alert" className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted">{meta.destHint}</p>
        )}

        {detected && (
          <p className="mt-2 text-xs font-semibold text-accent flex items-center gap-1.5">
            <Icon name="check_circle" className="w-3.5 h-3.5 shrink-0" />
            Terdeteksi operator: {detected}
          </p>
        )}
      </div>
    </div>
  );
};