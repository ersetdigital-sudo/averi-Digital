import type { Order, OrderStatus, VerifiedOrder } from '../types';
import {
  adminDecidePayment,
  createOrder,
  fetchAllOrders,
  fetchOrder,
  markPaymentReported,
  updateOrderFields,
  verifyOrderByInvoice,
} from '../app/actions/orders';

/**
 * Lapisan pesanan yang dipakai seluruh halaman.
 *
 * Dulu pesanan disimpan di localStorage browser — akibatnya admin hanya bisa
 * melihat pesanan yang dibuat di browser-nya sendiri dan pembeli tidak bisa
 * mengecek invoice dari perangkat lain. Sekarang seluruh data pesanan ada di
 * Supabase dan diakses lewat server action (`src/app/actions/orders.ts`).
 *
 * Nama & tanda tangan fungsi dipertahankan agar halaman pemanggil tidak perlu
 * diubah. Fungsi kode/invoice tetap murni di `./order-codes`.
 */

export { buildInvoice, buildPlnToken } from './order-codes';
export type { VerifyResult } from '../app/actions/orders';

import type { VerifyResult } from '../app/actions/orders';

/** Simpan pesanan baru (status PENDING_PAYMENT; serial & token belum ada). */
export async function saveOrder(order: Order): Promise<void> {
  await createOrder({
    invoice: order.invoice,
    productSlug: order.productSlug,
    serviceName: order.serviceName,
    providerName: order.providerName,
    nominalLabel: order.nominalLabel,
    destination: order.destination,
    total: order.total,
  });
}

/** Ambil satu pesanan berdasarkan invoice (halaman pembayaran/sukses/status). */
export async function getOrderByInvoice(invoice: string): Promise<Order | null> {
  return fetchOrder(invoice);
}

/**
 * Pelanggan menekan "Saya Sudah Bayar" — hanya laporan, bukan konfirmasi.
 * Status berpindah ke WAITING_VERIFICATION; serial/token belum boleh ada.
 */
export async function reportPayment(invoice: string): Promise<Order | null> {
  const result = await markPaymentReported(invoice);
  if (!result.ok) return null;
  return fetchOrder(invoice);
}

/** Semua pesanan — untuk panel verifikasi admin. */
export async function listOrders(): Promise<Order[]> {
  return fetchAllOrders();
}

/**
 * Verifikasi admin: setuju -> VERIFIED -> PROCESSING (serial/token terbit) ->
 * SUCCESS. Ditolak -> FAILED.
 */
export async function adminVerify(invoice: string, approve: boolean): Promise<Order | null> {
  const result = await adminDecidePayment(invoice, approve);
  if (!result.ok) return null;
  return fetchOrder(invoice);
}

/** Ubah sebagian field pesanan (serial, token, catatan, status). */
export async function updateOrder(
  invoice: string,
  patch: Partial<Order> & { adminNote?: string; status?: OrderStatus }
): Promise<Order | null> {
  const result = await updateOrderFields(invoice, {
    serial: patch.serial,
    token: patch.token,
    adminNote: patch.adminNote,
    status: patch.status,
  });
  if (!result.ok) return null;
  return fetchOrder(invoice);
}

/** Verifikasi pesanan oleh pelanggan: invoice + nomor tujuan harus cocok. */
export async function verifyOrder(invoice: string, destination: string): Promise<VerifyResult> {
  return verifyOrderByInvoice(invoice, destination);
}

export type { Order, VerifiedOrder };
