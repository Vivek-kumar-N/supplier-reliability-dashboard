import type { PurchaseOrder } from '../types';

export const TODAY = new Date('2026-11-12');

export function parseDate(s: string): Date {
  return new Date(s);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function isLate(po: PurchaseOrder): boolean {
  if (po.status === 'completed' || po.status === 'partial') {
    if (!po.actualDeliveryDate) return false;
    return po.actualDeliveryDate > po.expectedDeliveryDate;
  }
  // pending
  return parseDate(po.expectedDeliveryDate) < TODAY;
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
