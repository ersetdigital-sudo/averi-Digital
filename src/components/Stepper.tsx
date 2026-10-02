'use client';

import React from 'react';
import { Icon } from './Icon';

interface StepperProps {
  steps: string[];
  /** Langkah aktif (1-based). */
  current: number;
  /** Langkah terjauh yang pernah dicapai — untuk navigasi mundur. */
  maxReached: number;
  onJump: (step: number) => void;
}

/** Indikator progres wizard. Mobile: bar ringkas, desktop: stepper lingkaran. */
export const Stepper: React.FC<StepperProps> = ({ steps, current, maxReached, onJump }) => {
  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-ink">
            Langkah {current} dari {steps.length}
          </span>
          <span className="font-semibold text-accent">{steps[current - 1]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <ol className="hidden sm:flex items-center">
        {steps.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          const clickable = step <= maxReached && !active;

          const circle = done
            ? 'bg-accent-soft text-accent border-accent-soft'
            : active
              ? 'bg-accent text-white border-accent'
              : 'bg-white text-muted border-line';

          const text = active ? 'text-ink font-bold' : done ? 'text-accent font-semibold' : 'text-muted font-medium';

          return (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump(step)}
                className={`flex items-center gap-2.5 ${
                  clickable ? 'cursor-pointer group' : 'cursor-default'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${circle} ${
                    clickable ? 'group-hover:border-accent' : ''
                  }`}
                >
                  {done ? <Icon name="check" className="w-4 h-4" strokeWidth={2.6} /> : step}
                </span>
                <span className={`text-xs whitespace-nowrap transition-colors ${text}`}>{label}</span>
              </button>

              {i < steps.length - 1 && (
                <span
                  className={`flex-1 h-px mx-3 transition-colors ${
                    step < current ? 'bg-accent' : 'bg-line'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};