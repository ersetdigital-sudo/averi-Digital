import React from 'react';
import { Icon, type IconName } from '../../Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Versi ringkas untuk area kecil (mis. dalam card chart). */
  compact?: boolean;
}

/** Empty state yang disengaja — bukan card kosong yang terlihat rusak. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'info',
  title,
  description,
  action,
  compact,
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/60 text-center ${
      compact ? 'gap-1.5 px-4 py-8' : 'gap-2 px-6 py-12'
    }`}
  >
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-muted shadow-card">
      <Icon name={icon} className="h-4 w-4" />
    </span>
    <p className="text-sm font-bold text-ink">{title}</p>
    {description && <p className="max-w-[42ch] text-xs text-muted">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
