'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceId, Provider, Nominal, Order } from '../types';
import {
  PROVIDERS,
  NOMINALS,
  SERVICE_META,
  detectOperator,
  validateDestination,
} from '../data/catalog';
import { buildInvoiceAndSerial, buildPlnToken, saveOrder } from '../lib/orderStore';

export const CHECKOUT_STEPS = ['Layanan', 'Nomor Tujuan', 'Nominal', 'Konfirmasi'];
export const LAST_STEP = CHECKOUT_STEPS.length;

export type CheckoutPhase = 'form' | 'pay' | 'processing' | 'done';

/** Petakan (layanan, provider) menjadi kunci kategori di langkah 1. */
function catKeyFor(id: ServiceId, providerId?: string): string {
  if (id !== 'tagihan') return id;
  const map: Record<string, string> = {
    pdam: 'pdam',
    bpjs: 'bpjs',
    indihome: 'internet',
    multifinance: 'multifinance',
  };
  return map[providerId ?? ''] ?? 'pdam';
}

/**
 * State + logika checkout (murni, tanpa JSX).
 * Dipakai halaman `/checkout` lewat `CheckoutWidget`.
 */
export function useCheckout() {
  const searchParams = useSearchParams();

  // Prefill dari URL: /checkout?service=pln&prov=pln-prabayar&nom=pln100
  // Dibaca langsung saat render pertama supaya langkah 2 sudah tampil
  // pada SSR HTML tanpa menunggu efek (tidak ada kedipan langkah 1).
  const initial = useMemo(() => {
    const svc = searchParams.get('service') as ServiceId | null;
    if (!svc || !SERVICE_META[svc]) return null;
    const provs = PROVIDERS[svc];
    const prov =
      provs.find((p) => p.id === searchParams.get('prov')) || provs[0];
    const noms = NOMINALS[svc];
    const nom =
      noms.find((n) => n.id === searchParams.get('nom')) ||
      noms.find((n) => n.tag === 'POPULER') ||
      noms[0];
    return { svc, prov, nom, catKey: catKeyFor(svc, prov.id) };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [step, setStep] = useState(initial ? 2 : 1);
  const [maxReached, setMaxReached] = useState(initial ? 2 : 1);
  const [service, setService] = useState<ServiceId | null>(initial?.svc ?? null);
  const [catKey, setCatKey] = useState<string | null>(initial?.catKey ?? null);
  const [provider, setProvider] = useState<Provider | null>(initial?.prov ?? null);
  const [destination, setDestination] = useState('');
  const [nominal, setNominal] = useState<Nominal | null>(initial?.nom ?? null);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<CheckoutPhase>('form');
  const [invoice, setInvoice] = useState('');
  const [serial, setSerial] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const scrollToTop = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.getElementById('checkout-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const advanceTo = useCallback(
    (next: number) => {
      if (next < 1 || next > LAST_STEP) return;
      setStep(next);
      setMaxReached((m) => Math.max(m, next));
      setError(null);
      scrollToTop();
    },
    [scrollToTop]
  );

  /** Isi pilihan (layanan / provider / nominal) lalu lompat ke langkah 2. */
  const applySelection = useCallback(
    (svc: ServiceId, providerId?: string, nominalId?: string) => {
      const provs = PROVIDERS[svc];
      const prov = provs.find((p) => p.id === providerId) || provs[0];
      const noms = NOMINALS[svc];
      setService(svc);
      setProvider(prov);
      setNominal(
        noms.find((n) => n.id === nominalId) || noms.find((n) => n.tag === 'POPULER') || noms[0]
      );
      setDestination('');
      setCatKey(catKeyFor(svc, prov.id));
      advanceTo(2);
    },
    [advanceTo]
  );

  const pickNominal = (value: Nominal) => {
    setNominal(value);
    advanceTo(4);
  };

  const handleDestination = (value: string) => {
    setDestination(value);
    setError(null);
    if ((service === 'pulsa' || service === 'data') && provider) {
      const digits = value.replace(/\D/g, '');
      if (digits.length >= 4) {
        const name = detectOperator(value);
        const match = PROVIDERS[service].find((p) => p.name === name);
        if (match && match.id !== provider.id) {
          setProvider(match);
          setCatKey(catKeyFor(service, match.id));
        }
      }
    }
  };

  const canProceed = useMemo(() => {
    if (step === 1) return service !== null;
    if (step === 2) return service !== null && validateDestination(service, destination) === null;
    if (step === 3) return nominal !== null;
    return true;
  }, [step, service, destination, nominal]);

  const startPayment = (): boolean => {
    if (!service || !provider || !nominal) return false;
    if (step !== 4) return false;
    const { invoice: inv, serial: sn } = buildInvoiceAndSerial(new Date());
    setInvoice(inv);
    setSerial(sn);
    setPhase('pay');
    return true;
  };

  const goNext = () => {
    if (step === 2 && service) {
      const err = validateDestination(service, destination);
      if (err) {
        setError(err);
        return;
      }
    }
    if (step < LAST_STEP) {
      advanceTo(step + 1);
      return;
    }
    startPayment();
  };

  const handlePaid = () => {
    if (!service || !provider || !nominal) return;
    setPhase('processing');
    setTimeout(async () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        invoice,
        serviceName: SERVICE_META[service].name,
        providerName: provider.name,
        nominalLabel: nominal.label,
        destination,
        total: nominal.price,
        status: 'SUCCESS',
        createdAt: `Hari ini, ${timeStr} WIB`,
        serial,
        token: service === 'pln' ? buildPlnToken() : undefined,
      };
      setOrder(newOrder);
      await saveOrder(newOrder);
      setPhase('done');
      scrollToTop();
    }, 1700);
  };

  const restart = () => {
    setPhase('form');
    setStep(1);
    setMaxReached(1);
    setService(null);
    setCatKey(null);
    setProvider(null);
    setDestination('');
    setNominal(null);
    setError(null);
    setInvoice('');
    setSerial('');
    setOrder(null);
    scrollToTop();
  };

  return {
    step,
    maxReached,
    service,
    catKey,
    provider,
    setProvider,
    destination,
    nominal,
    error,
    phase,
    setPhase,
    invoice,
    order,
    canProceed,
    advanceTo,
    applySelection,
    handleDestination,
    pickNominal,
    goNext,
    handlePaid,
    restart,
  };
}
