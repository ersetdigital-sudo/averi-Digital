import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Aksi di sisi kanan (tombol/tautan). */
  action?: React.ReactNode;
  /** `page` untuk judul halaman, `section` untuk judul bagian. */
  variant?: 'page' | 'section';
  className?: string;
}

/** Judul halaman atau bagian — satu komponen agar hierarki tipografi konsisten. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
  variant = 'section',
  className,
}) => {
  const isPage = variant === 'page';

  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 ${className ?? ''}`}>
      <div className="min-w-0">
        {isPage ? (
          <h1 className="text-xl font-extrabold tracking-[-0.03em] text-ink sm:text-2xl">
            {title}
          </h1>
        ) : (
          <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-muted">{title}</h2>
        )}
        {description && (
          <p className={`text-muted ${isPage ? 'mt-1 text-sm' : 'mt-1 text-xs'}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
