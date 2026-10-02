import type { CategoryMeta } from '../types';

/**
 * Helper nomor tujuan — fungsi murni tanpa I/O sehingga aman dipakai di client
 * maupun server.
 */

/** Deteksi operator dari prefix nomor (khusus Pulsa & Paket Data). */
export function detectOperator(phone: string): string {
  const n = phone.replace(/\D/g, '');
  if (n.length < 4) return 'Telkomsel';
  if (/^08(11|12|13|21|22|23|51|52|53)/.test(n)) return 'Telkomsel';
  if (/^08(14|15|16|55|56|57|58)/.test(n)) return 'Indosat';
  if (/^08(17|18|19|59|77|78)/.test(n)) return 'XL Axiata';
  if (/^08(95|96|97|98|99)/.test(n)) return 'Tri';
  if (/^08(81|82|83|84|85|86|87|88|89)/.test(n)) return 'Smartfren';
  return 'Telkomsel';
}

/** Validasi nomor tujuan memakai aturan kategori. Mengembalikan pesan error atau null. */
export function validateDestination(
  meta: Pick<
    CategoryMeta,
    'destLabel' | 'phoneInput' | 'minDigits' | 'maxDigits'
  >,
  value: string
): string | null {
  const clean = value.replace(/\D/g, '');

  if (!clean) return `${meta.destLabel} belum diisi.`;

  if (meta.phoneInput) {
    if (!clean.startsWith('08')) return 'Nomor HP harus diawali 08.';
    if (clean.length < 9 || clean.length > 13) return 'Nomor HP tidak valid (9–13 digit).';
    return null;
  }

  if (clean.length < meta.minDigits) {
    return `${meta.destLabel} minimal ${meta.minDigits} digit.`;
  }
  if (clean.length > meta.maxDigits) {
    return `${meta.destLabel} maksimal ${meta.maxDigits} digit.`;
  }
  return null;
}
