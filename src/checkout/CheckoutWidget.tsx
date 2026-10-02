'use client';

import React from 'react';
import { BRAND, rupiah } from '../lib/config';
import { CHECKOUT_STEPS, useCheckout } from './useCheckout';
import { Stepper } from '../components/Stepper';
import { StepCategory } from '../components/steps/StepCategory';
import { StepDestination } from '../components/steps/StepDestination';
import { StepNominal } from '../components/steps/StepNominal';
import { StepConfirm } from '../components/steps/StepConfirm';
import { QrisPanel } from '../components/QrisPanel';
import { ResultCard } from '../components/ResultCard';
import { Icon } from '../components/Icon';

const Processing: React.FC = () => (
  <div className="py-12 flex flex-col items-center text-center">
    <span className="w-12 h-12 rounded-full border-[3px] border-line border-t-accent animate-spin" />
    <h2 className="text-lg font-extrabold text-ink mt-5">Memproses pembayaran…</h2>
    <p className="text-xs text-muted mt-1 max-w-xs leading-relaxed">
      Kami memverifikasi pembayaran lalu meneruskan pesanan ke biller resmi. Mohon tunggu
      sebentar.
    </p>
  </div>
);

interface Props {
  /** Dipanggil saat tombol keluar diklik (kembali ke beranda). */
  onExit: () => void;
  /** Teks tombol utama setelah transaksi selesai. */
  homeLabel?: string;
  /** Teks kecil di bawah judul (opsional). */
  hint?: string;
}

/**
 * Kartu checkout lengkap: stepper + 4 langkah + QRIS + layar sukses.
 * Dipakai di halaman `/checkout` — tidak lagi dibenamkan di beranda.
 */
export const CheckoutWidget: React.FC<Props> = ({ onExit, homeLabel = 'Kembali', hint }) => {
  const {
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
  } = useCheckout();

  const LAST_STEP = CHECKOUT_STEPS.length;

  return (
    <section className="py-10 sm:py-12 scroll-mt-24" id="checkout-top">
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-line bg-surface/60">
          <Stepper steps={CHECKOUT_STEPS} current={step} maxReached={maxReached} onJump={advanceTo} />
          {hint && <p className="mt-3 text-xs text-muted">{hint}</p>}
        </div>

        <div className="px-5 sm:px-8 py-7">
          {phase === 'form' && (
            <div key={step} className="animate-fade">
              {step === 1 && (
                <StepCategory
                  selectedKey={catKey}
                  onSelect={(id, prov) => {
                    applySelection(id, prov);
                  }}
                />
              )}
              {step === 2 && service && provider && (
                <StepDestination
                  service={service}
                  provider={provider}
                  onProvider={setProvider}
                  destination={destination}
                  onDestination={handleDestination}
                  error={error}
                />
              )}
              {step === 3 && service && (
                <StepNominal service={service} value={nominal} onSelect={pickNominal} />
              )}
              {step === 4 && service && provider && nominal && (
                <StepConfirm
                  service={service}
                  provider={provider}
                  destination={destination}
                  nominal={nominal}
                />
              )}
            </div>
          )}

          {phase === 'pay' && (
            <QrisPanel
              invoice={invoice}
              merchant={BRAND.merchant}
              amount={nominal?.price || 0}
              onPaid={handlePaid}
              onCancel={() => setPhase('form')}
            />
          )}

          {phase === 'processing' && <Processing />}

          {phase === 'done' && order && (
            <ResultCard order={order} onRestart={restart} onHome={onExit} homeLabel={homeLabel} />
          )}
        </div>

        {phase === 'form' && (
          <div className="px-5 sm:px-8 py-5 border-t border-line bg-surface/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (step === 1 ? onExit() : advanceTo(step - 1))}
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-line font-bold text-xs text-ink-soft hover:bg-white transition-colors cursor-pointer"
            >
              <Icon name="chevron_left" className="w-4 h-4" />
              {step === 1 ? 'Batal' : 'Kembali'}
            </button>

            <div className="flex items-center gap-4">
              {nominal && (
                <span className="hidden sm:inline text-xs text-muted">
                  Total <b className="text-ink num-tabular">{rupiah(nominal.price)}</b>
                </span>
              )}
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed}
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-accent hover:bg-accent-dark disabled:bg-line disabled:text-muted disabled:cursor-not-allowed text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {step === LAST_STEP ? (
                  <>
                    Bayar Sekarang <Icon name="qr" className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lanjut <Icon name="chevron_right" className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};