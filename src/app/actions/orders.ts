'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, getAdminUser } from '@/lib/supabase/server';
import { buildPlnToken, buildSerial, formatOrderTime, isPlnProduct } from '@/lib/order-codes';
import type { Order, OrderStatus, VerifiedOrder } from '@/types';

/**
 * Server action untuk pesanan.
 *
 * Tabel `orders` tidak bisa dibaca anon (berisi nomor tujuan & serial), jadi
 * semua akses lewat sini memakai service role. Aksi yang menyentuh data admin
 * WAJIB memverifikasi sesi admin lebih dulu.
 *
 * ATURAN STATUS: aksi pelanggan "Saya Sudah Bayar" hanya memindahkan status ke
 * WAITING_VERIFICATION. Serial & token baru dibuat saat admin memproses.
 */

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface CreateOrderInput {
  invoice: string;
  productSlug?: string;
  serviceName: string;
  providerName: string;
  nominalLabel: string;
  destination: string;
  total: number;
}

export interface VerifyResult {
  success: boolean;
  data?: VerifiedOrder;
  error?: string;
}

const DENIED = 'Akses ditolak. Silakan masuk sebagai admin.';

const NOT_FOUND_MESSAGE =
  'Pesanan tidak ditemukan atau data verifikasi tidak cocok. Periksa kembali nomor invoice dan nomor tujuan.';

/** Baris `orders` dari Supabase -> bentuk yang dipakai UI. */
interface OrderRow {
  id: string;
  invoice: string;
  product_slug: string | null;
  service_name: string;
  provider_name: string;
  nominal_label: string;
  destination: string;
  total: number | string;
  status: string;
  serial: string | null;
  token: string | null;
  created_at: string;
}

const ORDER_COLUMNS =
  'id, invoice, product_slug, service_name, provider_name, nominal_label, destination, total, status, serial, token, created_at';

function normalizeStatus(value: unknown): OrderStatus {
  const allowed: OrderStatus[] = [
    'PENDING_PAYMENT',
    'WAITING_VERIFICATION',
    'VERIFIED',
    'PROCESSING',
    'SUCCESS',
    'FAILED',
    'EXPIRED',
  ];
  const raw = String(value ?? '').toUpperCase() as OrderStatus;
  return allowed.includes(raw) ? raw : 'PENDING_PAYMENT';
}

function mapRow(row: OrderRow): Order {
  return {
    id: String(row.id),
    productSlug: row.product_slug ?? undefined,
    invoice: String(row.invoice),
    serviceName: String(row.service_name ?? ''),
    providerName: String(row.provider_name ?? ''),
    nominalLabel: String(row.nominal_label ?? ''),
    destination: String(row.destination ?? ''),
    total: Number(row.total ?? 0),
    status: normalizeStatus(row.status),
    createdAt: formatOrderTime(row.created_at),
    serial: row.serial ?? undefined,
    token: row.token ?? undefined,
  };
}

function maskDestination(value: string): string {
  const clean = value.trim();
  if (clean.length <= 4) return '••••';
  return `${clean.slice(0, 4)} •••• ${clean.slice(-4)}`;
}

function supportLink(invoice: string, whatsapp: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Halo CS Averi Digital, saya ingin menanyakan status pesanan dengan invoice ${invoice}.`
  )}`;
}

/* ================================================================== *
 * SISI PELANGGAN
 * ================================================================== */

/** Simpan pesanan baru (status PENDING_PAYMENT, belum ada serial/token). */
export async function createOrder(input: CreateOrderInput): Promise<ActionResult> {
  if (!input.destination?.trim()) {
    return { ok: false, error: 'Nomor tujuan belum diisi.' };
  }

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('orders').insert({
      invoice: input.invoice,
      product_slug: input.productSlug ?? null,
      service_name: input.serviceName,
      provider_name: input.providerName,
      nominal_label: input.nominalLabel,
      destination: input.destination.trim(),
      total: Number(input.total) || 0,
      status: 'PENDING_PAYMENT',
    });

    if (error) {
      // 23505 = invoice sudah dipakai.
      return { ok: false, error: error.code === '23505' ? 'Nomor invoice sudah dipakai.' : error.message };
    }

    revalidatePath('/admin/verifikasi');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Gagal menyimpan pesanan.' };
  }
}

/** Ambil satu pesanan berdasarkan nomor invoice (halaman pembayaran/status). */
export async function fetchOrder(invoice: string): Promise<Order | null> {
  const value = (invoice ?? '').trim();
  if (!value) return null;

  try {
    const { data, error } = await createAdminClient()
      .from('orders')
      .select(ORDER_COLUMNS)
      .ilike('invoice', value)
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data as OrderRow);
  } catch {
    return null;
  }
}

/**
 * Pelanggan menekan "Saya Sudah Bayar".
 * Ini hanya LAPORAN — status pindah ke WAITING_VERIFICATION, bukan SUCCESS.
 */
export async function markPaymentReported(invoice: string): Promise<ActionResult> {
  const value = (invoice ?? '').trim();
  if (!value) return { ok: false, error: 'Nomor invoice tidak valid.' };

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .ilike('invoice', value)
      .maybeSingle();

    if (error || !data) return { ok: false, error: 'Pesanan tidak ditemukan.' };

    const status = normalizeStatus(data.status);
    if (status === 'SUCCESS' || status === 'PROCESSING' || status === 'VERIFIED') {
      // Sudah melewati tahap ini, tidak perlu apa-apa lagi.
      return { ok: true };
    }
    if (status === 'WAITING_VERIFICATION') return { ok: true };

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'WAITING_VERIFICATION', payment_reported_at: new Date().toISOString() })
      .ilike('invoice', value);

    if (updateError) return { ok: false, error: updateError.message };

    revalidatePath('/admin/verifikasi');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Gagal melaporkan pembayaran.' };
  }
}

/** Verifikasi mandiri pelanggan: invoice + nomor tujuan harus cocok. */
export async function verifyOrderByInvoice(
  invoice: string,
  destination: string
): Promise<VerifyResult> {
  const inv = (invoice ?? '').trim();
  const dest = (destination ?? '').replace(/\D/g, '');

  if (!inv) return { success: false, error: 'Nomor invoice wajib diisi.' };
  if (dest.length < 4) {
    return { success: false, error: 'Masukkan nomor tujuan (minimal 4 digit) untuk verifikasi.' };
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_COLUMNS)
      .ilike('invoice', inv)
      .maybeSingle();

    if (error || !data) return { success: false, error: NOT_FOUND_MESSAGE };

    const row = data as OrderRow;
    const stored = String(row.destination ?? '').replace(/\D/g, '');
    const matches =
      stored === dest || stored.endsWith(dest) || dest.endsWith(stored);

    // Pesan error disamakan agar nomor invoice tidak bisa ditebak orang lain.
    if (!matches) return { success: false, error: NOT_FOUND_MESSAGE };

    const status = normalizeStatus(row.status);
    const revealProduct = status === 'VERIFIED' || status === 'PROCESSING' || status === 'SUCCESS';

    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'whatsapp_cs')
      .maybeSingle();

    const whatsapp = String(setting?.value ?? '6281234567890');

    return {
      success: true,
      data: {
        invoice: String(row.invoice),
        serviceName: String(row.service_name ?? ''),
        providerName: String(row.provider_name ?? ''),
        nominalLabel: String(row.nominal_label ?? ''),
        maskedDestination: maskDestination(String(row.destination ?? '')),
        total: Number(row.total ?? 0),
        paymentMethod: 'QRIS Standar Nasional',
        status,
        createdAt: formatOrderTime(row.created_at),
        // Serial & token disembunyikan sampai pembayaran terverifikasi.
        serial: revealProduct ? row.serial ?? undefined : undefined,
        token: revealProduct ? row.token ?? undefined : undefined,
        supportLink: supportLink(String(row.invoice), whatsapp),
      },
    };
  } catch {
    return { success: false, error: 'Terjadi gangguan saat memverifikasi pesanan.' };
  }
}

/* ================================================================== *
 * SISI ADMIN
 * ================================================================== */

/** Semua pesanan, terbaru dulu — untuk panel verifikasi admin. */
export async function fetchAllOrders(): Promise<Order[]> {
  if (!(await getAdminUser())) return [];

  try {
    const { data, error } = await createAdminClient()
      .from('orders')
      .select(ORDER_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(300);

    if (error || !data) return [];
    return (data as OrderRow[]).map(mapRow);
  } catch {
    return [];
  }
}

/**
 * Keputusan admin atas laporan pembayaran.
 *   approve = true  -> VERIFIED, lalu proses (serial/token terbit) -> SUCCESS
 *   approve = false -> FAILED
 */
export async function adminDecidePayment(
  invoice: string,
  approve: boolean
): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const inv = (invoice ?? '').trim();
  if (!inv) return { ok: false, error: 'Nomor invoice tidak valid.' };

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .select('id, status, product_slug, serial, token')
      .ilike('invoice', inv)
      .maybeSingle();

    if (error || !data) return { ok: false, error: 'Pesanan tidak ditemukan.' };

    const status = normalizeStatus(data.status);

    if (!approve) {
      if (status === 'SUCCESS') {
        return { ok: false, error: 'Pesanan yang sudah berhasil tidak bisa ditolak.' };
      }
      const { error: failError } = await supabase
        .from('orders')
        .update({ status: 'FAILED' })
        .eq('id', data.id);
      if (failError) return { ok: false, error: failError.message };
      revalidatePath('/admin/verifikasi');
      return { ok: true };
    }

    if (status === 'SUCCESS') return { ok: true };
    if (status !== 'WAITING_VERIFICATION' && status !== 'PENDING_PAYMENT' && status !== 'VERIFIED') {
      return { ok: false, error: `Status ${status} tidak bisa diverifikasi.` };
    }

    // 1. Verifikasi pembayaran
    const verified = await supabase
      .from('orders')
      .update({ status: 'VERIFIED', verified_at: new Date().toISOString() })
      .eq('id', data.id);
    if (verified.error) return { ok: false, error: verified.error.message };

    // 2. Proses produk — serial & token DIBUAT DI SINI, bukan sebelumnya.
    const serial = data.serial || buildSerial();
    const token = isPlnProduct(data.product_slug) ? data.token || buildPlnToken() : data.token;

    const processed = await supabase
      .from('orders')
      .update({
        status: 'PROCESSING',
        serial,
        token: token ?? null,
        processed_at: new Date().toISOString(),
      })
      .eq('id', data.id);
    if (processed.error) return { ok: false, error: processed.error.message };

    // 3. Selesai
    const done = await supabase.from('orders').update({ status: 'SUCCESS' }).eq('id', data.id);
    if (done.error) return { ok: false, error: done.error.message };

    revalidatePath('/admin/verifikasi');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Gagal memproses pesanan.' };
  }
}

/** Ubah sebagian field pesanan (serial, token, catatan admin). */
export async function updateOrderFields(
  invoice: string,
  patch: { serial?: string; token?: string; adminNote?: string; status?: OrderStatus }
): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: DENIED };

  const inv = (invoice ?? '').trim();
  if (!inv) return { ok: false, error: 'Nomor invoice tidak valid.' };

  try {
    const payload: Record<string, unknown> = {};
    if (patch.serial !== undefined) payload.serial = patch.serial || null;
    if (patch.token !== undefined) payload.token = patch.token || null;
    if (patch.adminNote !== undefined) payload.admin_note = patch.adminNote || null;
    if (patch.status !== undefined) payload.status = normalizeStatus(patch.status);

    if (Object.keys(payload).length === 0) return { ok: true };

    const { error } = await createAdminClient()
      .from('orders')
      .update(payload)
      .ilike('invoice', inv);

    if (error) return { ok: false, error: error.message };

    revalidatePath('/admin/verifikasi');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Gagal menyimpan perubahan.' };
  }
}

/** Statistik ringkas untuk panel admin. */
export async function fetchDashboardStats(): Promise<Record<string, number> | null> {
  if (!(await getAdminUser())) return null;

  try {
    const { data, error } = await createAdminClient().rpc('admin_dashboard_stats');
    if (error || !data) return null;
    return data as Record<string, number>;
  } catch {
    return null;
  }
}
