import type {
  Supplier,
  Product,
  PurchaseOrder,
  SupplierMetrics,
  HiddenIssue,
  RiskThresholds,
} from '../types';
import {
  calcOnTimeRate,
  calcAllSupplierMetrics,
  DEFAULT_THRESHOLDS,
} from './scoring';
import { isLate } from './dateUtils';

// ─── Hidden Issue Detection ───────────────────────────────────────────────────

export function detectHiddenIssues(
  suppliers: Supplier[],
  products: Product[],
  orders: PurchaseOrder[],
  thresholds: RiskThresholds = DEFAULT_THRESHOLDS,
): HiddenIssue[] {
  const allMetrics = calcAllSupplierMetrics(suppliers, orders, thresholds);
  const issues: HiddenIssue[] = [];

  for (const supplier of suppliers) {
    const supplierMetrics = allMetrics.find(m => m.supplierId === supplier.id);
    if (!supplierMetrics) continue;

    const supplierOnTimeRate = supplierMetrics.onTimeRate;
    const supplierOrders = orders.filter(o => o.supplierId === supplier.id);
    const supplierDone = supplierOrders.filter(
      o => o.status === 'completed' || o.status === 'partial',
    );

    // Supplier-level short delivery rate
    const supplierShortOrders = supplierDone.filter(o => {
      const received = o.receivedQuantity ?? o.orderedQuantity;
      return received < o.orderedQuantity;
    });
    const supplierShortRate =
      supplierDone.length > 0 ? (supplierShortOrders.length / supplierDone.length) * 100 : 0;

    // Supplier-level quality issue rate
    const supplierQualityIssueOrders = supplierDone.filter(o => o.qualityIssues.length > 0);
    const supplierQualityRate =
      supplierDone.length > 0
        ? (supplierQualityIssueOrders.length / supplierDone.length) * 100
        : 0;

    for (const product of products) {
      const productOrders = orders.filter(
        o => o.supplierId === supplier.id && o.productId === product.id,
      );
      const productDone = productOrders.filter(
        o => o.status === 'completed' || o.status === 'partial',
      );

      if (productDone.length < 3) continue;

      // Product-level on-time rate
      const productOnTimeRate = calcOnTimeRate(productOrders);

      // Product-level short delivery rate
      const productShortOrders = productDone.filter(o => {
        const received = o.receivedQuantity ?? o.orderedQuantity;
        return received < o.orderedQuantity;
      });
      const productShortRate = (productShortOrders.length / productDone.length) * 100;

      // Product-level quality issue rate
      const productQualityIssueOrders = productDone.filter(o => o.qualityIssues.length > 0);
      const productQualityRate = (productQualityIssueOrders.length / productDone.length) * 100;

      const lateCount = productDone.filter(o => isLate(o)).length;

      // ── Delivery hidden issue ──────────────────────────────────────────────
      if (productOnTimeRate < 50 && supplierOnTimeRate >= 50) {
        const severity = productOnTimeRate < 20 ? 'critical' : 'warning';
        issues.push({
          supplierId: supplier.id,
          productId: product.id,
          issueType: 'delivery',
          severity,
          evidence: [
            `${lateCount} of ${productDone.length} deliveries for ${product.name} were late`,
            `Product on-time rate: ${productOnTimeRate.toFixed(1)}% vs supplier overall: ${supplierOnTimeRate.toFixed(1)}%`,
            `Late deliveries span ${productOrders.length} purchase orders`,
          ],
          description:
            'Product-level delivery performance is significantly worse than supplier overall metrics suggest',
        });
      }

      // ── Quantity hidden issue ──────────────────────────────────────────────
      if (productShortRate > 40 && supplierShortRate < 20) {
        issues.push({
          supplierId: supplier.id,
          productId: product.id,
          issueType: 'quantity',
          severity: productShortRate > 60 ? 'critical' : 'warning',
          evidence: [
            `${productShortOrders.length} of ${productDone.length} orders for ${product.name} had quantity shortfalls`,
            `Product short-delivery rate: ${productShortRate.toFixed(1)}% vs supplier overall: ${supplierShortRate.toFixed(1)}%`,
          ],
          description:
            'Product-level quantity shortfall is significantly worse than the supplier average',
        });
      }

      // ── Quality hidden issue ───────────────────────────────────────────────
      if (productQualityRate > 30 && supplierQualityRate < 15) {
        issues.push({
          supplierId: supplier.id,
          productId: product.id,
          issueType: 'quality',
          severity: productQualityRate > 50 ? 'critical' : 'warning',
          evidence: [
            `${productQualityIssueOrders.length} of ${productDone.length} orders for ${product.name} had quality issues`,
            `Product quality-issue rate: ${productQualityRate.toFixed(1)}% vs supplier overall: ${supplierQualityRate.toFixed(1)}%`,
          ],
          description:
            'Product-level quality issues are significantly worse than the supplier average',
        });
      }
    }
  }

  return issues;
}

// ─── Analysis Helpers ─────────────────────────────────────────────────────────

export function getMostDelayedSuppliers(allMetrics: SupplierMetrics[]): SupplierMetrics[] {
  return [...allMetrics].sort((a, b) => b.lateDeliveries - a.lateDeliveries);
}

export function getRecurringDelayProducts(
  suppliers: Supplier[],
  products: Product[],
  orders: PurchaseOrder[],
): Array<{ product: Product; supplier: Supplier; lateRate: number; orderCount: number }> {
  const results: Array<{ product: Product; supplier: Supplier; lateRate: number; orderCount: number }> = [];

  for (const supplier of suppliers) {
    for (const product of products) {
      const productOrders = orders.filter(
        o => o.supplierId === supplier.id && o.productId === product.id,
      );
      const done = productOrders.filter(
        o => o.status === 'completed' || o.status === 'partial',
      );
      if (done.length < 3) continue;

      const lateCount = done.filter(o => isLate(o)).length;
      const lateRate = (lateCount / done.length) * 100;

      if (lateRate > 50) {
        results.push({ product, supplier, lateRate, orderCount: done.length });
      }
    }
  }

  return results.sort((a, b) => b.lateRate - a.lateRate);
}

export function getQuantityShortfallSuppliers(
  suppliers: Supplier[],
  allMetrics: SupplierMetrics[],
): Array<{ supplier: Supplier; metrics: SupplierMetrics; shortfallPct: number }> {
  return suppliers
    .map(supplier => {
      const metrics = allMetrics.find(m => m.supplierId === supplier.id);
      if (!metrics) return null;
      const shortfallPct = 100 - metrics.qtyFulfillmentRate;
      return { supplier, metrics, shortfallPct };
    })
    .filter((item): item is { supplier: Supplier; metrics: SupplierMetrics; shortfallPct: number } =>
      item !== null && item.shortfallPct > 0,
    )
    .sort((a, b) => b.shortfallPct - a.shortfallPct);
}

export function getQualityProblemSuppliers(
  suppliers: Supplier[],
  allMetrics: SupplierMetrics[],
): Array<{ supplier: Supplier; metrics: SupplierMetrics }> {
  return suppliers
    .map(supplier => {
      const metrics = allMetrics.find(m => m.supplierId === supplier.id);
      if (!metrics) return null;
      return { supplier, metrics };
    })
    .filter((item): item is { supplier: Supplier; metrics: SupplierMetrics } =>
      item !== null && item.metrics.qualityIssueCount > 0,
    )
    .sort((a, b) => b.metrics.qualityIssueCount - a.metrics.qualityIssueCount);
}
