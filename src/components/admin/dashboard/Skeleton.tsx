import React from 'react';
import { CARD } from './styles';

/** Blok skeleton dasar. */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-line/60 ${className ?? ''}`} aria-hidden="true" />
);

/**
 * Skeleton yang mengikuti layout dashboard final, supaya tidak ada "lompatan"
 * dan tidak menampilkan angka 0 saat data masih dimuat.
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8" aria-busy="true" aria-live="polite">
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`${CARD} p-5`}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-7 w-16" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[62px] rounded-xl" />
      ))}
    </div>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>

    <Skeleton className="h-64 rounded-2xl" />
  </div>
);
