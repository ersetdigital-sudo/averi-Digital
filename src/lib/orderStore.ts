import { Order, VerifiedOrder } from '../types';
import { BRAND, waLink } from './config';

const STORAGE_KEY = '_topupin_orders';

export interface VerifyResult {
  success: boolean;
  data?: VerifiedOrder;
  error?: string;
}

function maskDestination(value: string): string {
  const clean = value.trim();
  if (clean.length <= 4) return '••••';
  return `${clean.slice(0, 4)} •••• ${clean.slice(-4)}`;
}

/** Ambil daftar pesanan dari localStorage, dengan 1 contoh awal. */
function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    // abaikan
  }

  const seed: Order[] = [
    {
      id: 'ord-seed-1',
      invoice: 'TPN-2026-48210',
      serviceName: 'Pulsa Reguler',
      providerName: 'Telkomsel',
      nominalLabel: '25.000',
      destination: '081234567890',
      total: 25750,
      status: 'SUCCESS',
      createdAt: 'Hari ini, 09:12 WIB',
      serial: '202610020912557741',
    },
    {
      id: 'ord-seed-2',
      invoice: 'TPN-2026-47389',
      serviceName: 'Token Listrik PLN',
      providerName: 'PLN Prabayar',
      nominalLabel: '100.000',
      destination: '14285910245',
      total: 102500,
      status: 'SUCCESS',
      createdAt: 'Kemarin, 20:31 WIB',
      serial: 'PLN202610012031902',
      token: '5512-9043-7718-2204-8861',
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {
    // abaikan
  }
  return seed;
}

/** Simpan satu pesanan (paling baru di atas). */
export async function saveOrder(order: Order): Promise<void> {
  const current = readOrders();
  const next = [order, ...current.filter((o) => o.invoice !== order.invoice)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // abaikan
  }
}

/** Buat nomor invoice & serial baru dari template waktu saat ini. */
export function buildInvoiceAndSerial(now: Date): { invoice: string; serial: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const invoice = `TPN-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  const serial = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${Math.floor(100000 + Math.random() * 899999)}`;
  return { invoice, serial };
}

/** Buat token PLN 20 digit terformat 5 grup. */
export function buildPlnToken(): string {
  return Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join('-');
}

/**
 * Verifikasi pesanan memakai kombinasi Nomor Invoice + Nomor tujuan.
 * Data hanya dikembalikan bila keduanya cocok, dan nomor tujuan di-mask.
 */
export async function verifyOrder(invoice: string, destination: string): Promise<VerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const inv = invoice.trim().toUpperCase();
  const dest = destination.replace(/\D/g, '');

  if (!inv) return { success: false, error: 'Nomor invoice wajib diisi.' };
  if (dest.length < 4) {
    return { success: false, error: 'Masukkan nomor tujuan (minimal 4 digit) untuk verifikasi.' };
  }

  const match = readOrders().find((o) => o.invoice.toUpperCase() === inv);
  const stored = match ? match.destination.replace(/\D/g, '') : '';
  const destOk =
    match !== undefined && (stored === dest || stored.endsWith(dest) || dest.endsWith(stored));

  if (!match || !destOk) {
    return {
      success: false,
      error:
        'Pesanan tidak ditemukan atau data verifikasi tidak cocok. Periksa kembali nomor invoice dan nomor tujuan.',
    };
  }

  return {
    success: true,
    data: {
      invoice: match.invoice,
      serviceName: match.serviceName,
      providerName: match.providerName,
      nominalLabel: match.nominalLabel,
      maskedDestination: maskDestination(match.destination),
      total: match.total,
      paymentMethod: 'QRIS Standar Nasional',
      status: match.status,
      createdAt: match.createdAt,
      serial: match.serial,
      token: match.token,
      supportLink: waLink(
        `Halo CS ${BRAND.name}, saya ingin menanyakan status pesanan dengan invoice ${match.invoice}.`
      ),
    },
  };
}