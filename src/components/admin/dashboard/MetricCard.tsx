import React from 'react';
import { Icon, type IconName } from '../../Icon';
import { CARD, NUM } from './styles';

export type MetricTone = 'neutral' | 'accent' | 'success' | 'warning';

const TONE_CHIP: Record<MetricTone, string> = {
  neutral: 'bg-surface text-ink-soft',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-gold-soft text-gold',
};

interface MetricCardProps {
  label: string;
  value: string;
  icon: IconName;
  tone?: MetricTone;
  /** `primary` = menonjol, `secondary` = ringkas. */
  variant?: 'primary' | 'secondary';
  /** Konteks tambahan dari data nyata (mis. "dari 62 produk"). */
  hint?: string;
}

/** Kartu metrik dengan dua tingkat kepentingan visual. */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  tone = 'neutral',
  variant = 'primary',
  hint,
}) => {
  if (variant === 'secondary') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white px-4 py-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TONE_CHIP[tone]}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {label}
          </p>
          <p className={`text-lg font-extrabold text-ink ${NUM}`}>{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TONE_CHIP[tone]}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className={`mt-4 text-[28px] font-extrabold leading-none text-ink ${NUM}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
};
