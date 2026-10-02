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

/** Ambil satu pesanan berdasarkan invoice (halaman pembayaran & sukses). */
export async function getOrderByInvoice(invoice: string): Promise<Order | null> {
  const inv = invoice.trim().toUpperCase();
  return readOrders().find((o) => o.invoice.toUpperCase() === inv) ?? null;
}

/** Ubah sebagian field pesanan (status, serial, token, dsb.). */
export async function updateOrder(
  invoice: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.invoice.toUpperCase() === invoice.trim().toUpperCase());
  if (idx === -1) return null;
  const updated: Order = { ...orders[idx], ...patch };
  orders[idx] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // abaikan
  }
  return updated;
}

/** Buat nomor invoice baru dari template waktu saat ini. */
export function buildInvoice(now: Date): string {
  return `TPN-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
}

/** Buat serial number dari template waktu saat ini (hanya saat deliveri). */
function buildSerial(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${Math.floor(100000 + Math.random() * 899999)}`;
}

/** Semua pesanan — untuk panel verifikasi admin. */
export async function listOrders(): Promise<Order[]> {
  return readOrders();
}

/**
 * User menekan "Saya Sudah Bayar" — ini hanya LAPORAN, bukan konfirmasi.
 * Status berpindah PENDING_PAYMENT → WAITING_VERIFICATION; serial/token
 * belum boleh ada pada tahap ini.
 */
export async function reportPayment(invoice: string): Promise<Order | null> {
  const order = await getOrderByInvoice(invoice);
  if (!order || order.status !== 'PENDING_PAYMENT') return null;
  return updateOrder(invoice, { status: 'WAITING_VERIFICATION' });
}

/**
 * Verifikasi admin: pembayaran valid → VERIFIED → diproses (serial/token
 * dibuat di sini, bukan sebelumnya) → SUCCESS. Ditolak → FAILED.
 */
export async function adminVerify(invoice: string, approve: boolean): Promise<Order | null> {
  const order = await getOrderByInvoice(invoice);
  if (!order || order.status !== 'WAITING_VERIFICATION') return null;

  if (!approve) return updateOrder(invoice, { status: 'FAILED' });

  await updateOrder(invoice, { status: 'VERIFIED' });
  await new Promise((r) => setTimeout(r, 700));
  await updateOrder(invoice, { status: 'PROCESSING' });
  await new Promise((r) => setTimeout(r, 900));

  const fresh = await getOrderByInvoice(invoice);
  if (!fresh) return null;
  const isPln = fresh.productSlug?.startsWith('pln-') ?? false;
  return updateOrder(invoice, {
    status: 'SUCCESS',
    serial: buildSerial(new Date()),
    token: isPln ? buildPlnToken() : undefined,
  });
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