import type { IconName } from '../components/Icon';

/** Pilihan ikon yang boleh dipakai kategori (semua ada di `components/Icon`). */
export const ICON_OPTIONS: IconName[] = [
  'call',
  'wifi',
  'wallet',
  'bolt',
  'router',
  'health_and_safety',
  'payments',
  'water_drop',
  'receipt',
  'receipt_long',
  'qr',
  'shield',
  'spark',
  'wallet',
  'price_check',
  'support_agent',
];

/** Ikon cadangan bila nilai dari DB tidak dikenal. */
export const DEFAULT_ICON: IconName = 'receipt';
