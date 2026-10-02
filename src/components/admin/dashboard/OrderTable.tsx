import React from 'react';
import type { Order } from '../../../types';
import { rupiah } from '../../../lib/config';
import { StatusPill } from './StatusPill';

/**
 * Daftar pesanan: tabel di desktop, daftar kartu di tablet/mobile.
 * Sengaja tidak memaksa tabel di layar sempit agar tidak ada scroll horizontal.
 */
export const OrderTable: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <>
    {/* Desktop */}
    <div className="hidden lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line/70 text-[11px] uppercase tracking-[0.1em] text-muted">
            <th scope="col" className="pb-3 pl-5 pr-4 font-bold">Pesanan</th>
            <th scope="col" className="px-4 pb-3 font-bold">Customer</th>
            <th scope="col" className="px-4 pb-3 font-bold">Total</th>
            <th scope="col" className="px-4 pb-3 font-bold">Status</th>
            <th scope="col" className="pb-3 pl-4 pr-5 font-bold xl:table-cell hidden">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {orders.map((order) => (
            <tr key={order.id} className="align-middle transition-colors hover:bg-surface/60">
              <td className="py-3.5 pl-5 pr-4">
                <p className="text-xs font-bold text-ink num-tabular">{order.invoice}</p>
                <p className="max-w-[240px] truncate text-xs text-muted">{order.serviceName}</p>
              </td>
              <td className="px-4 py-3.5">
                <p className="max-w-[180px] truncate text-xs text-ink-soft num-tabular">
                  {order.destination}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-xs font-bold text-ink num-tabular">
                {rupiah(order.total)}
              </td>
              <td className="px-4 py-3.5">
                <StatusPill status={order.status} />
              </td>
              <td className="hidden whitespace-nowrap py-3.5 pl-4 pr-5 text-xs text-muted xl:table-cell">
                {order.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Tablet & mobile */}
    <ul className="divide-y divide-line/70 lg:hidden">
      {orders.map((order) => (
        <li key={order.id} className="px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink num-tabular">{order.invoice}</p>
              <p className="truncate text-xs text-muted">{order.serviceName}</p>
            </div>
            <StatusPill status={order.status} />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <span className="truncate text-xs text-ink-soft num-tabular">{order.destination}</span>
            <span className="whitespace-nowrap text-xs font-bold text-ink num-tabular">
              {rupiah(order.total)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted">{order.createdAt}</p>
        </li>
      ))}
    </ul>
  </>
);
