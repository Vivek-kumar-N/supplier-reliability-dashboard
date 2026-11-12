import type {
  PurchaseOrder,
  Supplier,
  SupplierMetrics,
  ProductMetrics,
  RiskLevel,
  RiskThresholds,
} from '../types';
import { isLate, TODAY } from './dateUtils';

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  critical: 50,
  high: 70,
  medium: 85,
};

/** On-time rate for completed + partial orders (0–100) */
export function calcOnTimeRate(orders: PurchaseOrder[]): number {
  const done = orders.filter(o => o.status === 'completed' || o.status === 'partial');
  if (done.length === 0) return 0;
  const onTime = done.filter(o => !isLate(o)).length;
  return (onTime / done.length) * 100;
}

/** Quantity fulfilment rate for completed + partial orders (0–100) */
export function calcQtyFulfillmentRate(orders: PurchaseOrder[]): number {
  const done = orders.filter(o => o.status === 'completed' || o.status === 'partial');
  if (done.length === 0) return 100;
  const totalOrdered = done.reduce((s, o) => s + o.orderedQuantity, 0);
  if (totalOrdered === 0) return 100;
  const totalReceived = done.reduce((s, o) => s + (o.receivedQuantity ?? o.orderedQuantity), 0);
  return (totalReceived / totalOrdered) * 100;
}

/** Quality performance rate — % of completed+partial orders with no quality issues (0–100) */
export function calcQualityPerformanceRate(orders: PurchaseOrder[]): number {
  const done = orders.filter(o => o.status === 'completed' || o.status === 'partial');
  if (done.length === 0) return 100;
  const clean = done.filter(o => o.qualityIssues.length === 0).length;
  return (clean / done.length) * 100;
}

/** Weighted reliability score (0–100) */
export function calcReliabilityScore(onTime: number, qty: number, quality: number): number {
  return onTime * 0.40 + qty * 0.35 + quality * 0.25;
}

/** Map score to risk level using configurable thresholds */
export function getRiskLevel(score: number, thresholds: RiskThresholds): RiskLevel {
  if (score < thresholds.critical) return 'Critical';
  if (score < thresholds.high) return 'High';
  if (score < thresholds.medium) return 'Medium';
  return 'Low';
}

/** Compute all metrics for a single supplier */
export function calcSupplierMetrics(
  supplier: Supplier,
  orders: PurchaseOrder[],
  thresholds: RiskThresholds = DEFAULT_THRESHOLDS,
): SupplierMetrics {
  const supplierOrders = orders.filter(o => o.supplierId === supplier.id);
  const done = supplierOrders.filter(o => o.status === 'completed' || o.status === 'partial');
  const pending = supplierOrders.filter(o => o.status === 'pending');

  const onTimeDeliveries = done.filter(o => !isLate(o)).length;
  const lateDeliveries = done.filter(o => isLate(o)).length;

  const totalOrderedQty = done.reduce((s, o) => s + o.orderedQuantity, 0);
  const totalReceivedQty = done.reduce((s, o) => s + (o.receivedQuantity ?? o.orderedQuantity), 0);
  const qualityIssueCount = done.filter(o => o.qualityIssues.length > 0).length;

  const onTimeRate = calcOnTimeRate(supplierOrders);
  const qtyFulfillmentRate = calcQtyFulfillmentRate(supplierOrders);
  const qualityPerformanceRate = calcQualityPerformanceRate(supplierOrders);
  const reliabilityScore = calcReliabilityScore(onTimeRate, qtyFulfillmentRate, qualityPerformanceRate);
  const riskLevel = getRiskLevel(reliabilityScore, thresholds);

  return {
    supplierId: supplier.id,
    totalOrders: supplierOrders.length,
    completedOrders: done.length,
    onTimeDeliveries,
    lateDeliveries,
    pendingOrders: pending.length,
    totalOrderedQty,
    totalReceivedQty,
    qualityIssueCount,
    onTimeRate,
    qtyFulfillmentRate,
    qualityPerformanceRate,
    reliabilityScore,
    riskLevel,
  };
}

/** Compute product-level metrics for a specific supplier × product combination */
export function calcProductMetrics(
  supplierId: string,
  productId: string,
  orders: PurchaseOrder[],
): ProductMetrics {
  const filtered = orders.filter(
    o => o.supplierId === supplierId && o.productId === productId,
  );
  const done = filtered.filter(o => o.status === 'completed' || o.status === 'partial');

  const onTimeDeliveries = done.filter(o => !isLate(o)).length;
  const lateDeliveries = done.filter(o => isLate(o)).length;
  const qualityIssues = done.filter(o => o.qualityIssues.length > 0).length;
  const onTimeRate = done.length > 0 ? (onTimeDeliveries / done.length) * 100 : 0;

  // Average shortfall percentage per completed order
  const shortfallPcts = done.map(o => {
    const received = o.receivedQuantity ?? o.orderedQuantity;
    if (o.orderedQuantity === 0) return 0;
    return Math.max(0, ((o.orderedQuantity - received) / o.orderedQuantity) * 100);
  });
  const avgShortfallPct =
    shortfallPcts.length > 0
      ? shortfallPcts.reduce((s, v) => s + v, 0) / shortfallPcts.length
      : 0;

  return {
    productId,
    supplierId,
    totalOrders: filtered.length,
    completedOrders: done.length,
    onTimeDeliveries,
    lateDeliveries,
    qualityIssues,
    onTimeRate,
    avgShortfallPct,
  };
}

/** Compute metrics for all suppliers */
export function calcAllSupplierMetrics(
  suppliers: Supplier[],
  orders: PurchaseOrder[],
  thresholds: RiskThresholds = DEFAULT_THRESHOLDS,
): SupplierMetrics[] {
  return suppliers.map(s => calcSupplierMetrics(s, orders, thresholds));
}

// Re-export TODAY so callers don't need to import from two places
export { TODAY };
