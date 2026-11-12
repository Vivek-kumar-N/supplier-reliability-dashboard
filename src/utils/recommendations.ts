import type {
  Supplier,
  Product,
  PurchaseOrder,
  Recommendation,
  RecommendationPriority,
  RiskThresholds,
} from '../types';
import {
  calcSupplierMetrics,
  calcProductMetrics,
  DEFAULT_THRESHOLDS,
} from './scoring';
import { detectHiddenIssues } from './issueDetection';
import { isLate } from './dateUtils';

let recCounter = 0;

function nextRecId(): string {
  recCounter += 1;
  return `REC-${String(recCounter).padStart(3, '0')}`;
}

function recKey(supplierId: string, productId: string | undefined, issueType: string): string {
  return `${supplierId}|${productId ?? ''}|${issueType}`;
}

export function generateRecommendations(
  suppliers: Supplier[],
  products: Product[],
  orders: PurchaseOrder[],
  thresholds: RiskThresholds = DEFAULT_THRESHOLDS,
): Recommendation[] {
  recCounter = 0;
  const recs: Recommendation[] = [];
  const seen = new Set<string>();

  const hiddenIssues = detectHiddenIssues(suppliers, products, orders, thresholds);

  function addRec(r: Omit<Recommendation, 'id'>): void {
    const key = recKey(r.supplierId, r.productId, r.issueType);
    if (seen.has(key)) return;
    seen.add(key);
    recs.push({ id: nextRecId(), ...r });
  }

  for (const supplier of suppliers) {
    const supplierOrders = orders.filter(o => o.supplierId === supplier.id);
    const metrics = calcSupplierMetrics(supplier, supplierOrders, thresholds);

    const issueFlags: string[] = [];

    // ── R1: Product-level late delivery (≥3 completed orders, lateRate >70%) ──
    for (const product of products) {
      const productOrders = supplierOrders.filter(o => o.productId === product.id);
      const productMetrics = calcProductMetrics(supplier.id, product.id, supplierOrders);

      if (productMetrics.completedOrders < 3) continue;

      const latePos = productOrders.filter(
        o => (o.status === 'completed' || o.status === 'partial') && isLate(o),
      );
      const lateRate =
        productMetrics.completedOrders > 0
          ? (latePos.length / productMetrics.completedOrders) * 100
          : 0;

      if (lateRate > 70) {
        issueFlags.push('delivery');
        addRec({
          supplierId: supplier.id,
          productId: product.id,
          issueType: 'delivery',
          priority: 'High',
          action: `Schedule a delivery performance review with ${supplier.name} specifically for ${product.name}.`,
          evidence: [
            `${latePos.length} of ${productMetrics.completedOrders} orders were late (${lateRate.toFixed(1)}%)`,
            `Late deliveries are recurring across multiple months`,
          ],
          poIds: latePos.map(o => o.id),
        });
      }
    }

    // ── R2: Overall quantity shortfall ────────────────────────────────────────
    if (metrics.qtyFulfillmentRate < 80) {
      issueFlags.push('quantity');
      const shortOrders = supplierOrders.filter(
        o =>
          (o.status === 'completed' || o.status === 'partial') &&
          (o.receivedQuantity ?? o.orderedQuantity) < o.orderedQuantity,
      );
      addRec({
        supplierId: supplier.id,
        productId: undefined,
        issueType: 'quantity',
        priority: 'High',
        action: `Review ordered versus received quantities with ${supplier.name} and request an explanation for recurring shortfalls.`,
        evidence: [
          `Quantity fulfilment rate: ${metrics.qtyFulfillmentRate.toFixed(1)}%`,
          `${shortOrders.length} orders had quantity shortfalls`,
        ],
        poIds: shortOrders.map(o => o.id),
      });
    }

    // ── R3: Overall quality issue rate >25% ──────────────────────────────────
    const qualityIssueRate =
      metrics.completedOrders > 0
        ? (metrics.qualityIssueCount / metrics.completedOrders) * 100
        : 0;

    if (qualityIssueRate > 25) {
      issueFlags.push('quality');
      const qualityOrders = supplierOrders.filter(
        o =>
          (o.status === 'completed' || o.status === 'partial') &&
          o.qualityIssues.length > 0,
      );
      addRec({
        supplierId: supplier.id,
        productId: undefined,
        issueType: 'quality',
        priority: 'High',
        action: `Initiate a quality review with ${supplier.name} and inspect the affected product batches.`,
        evidence: [
          `Quality issue rate: ${qualityIssueRate.toFixed(1)}% of completed orders`,
          `${metrics.qualityIssueCount} orders had quality issues`,
        ],
        poIds: qualityOrders.map(o => o.id),
      });
    }

    // ── R4: Multiple issue types → comprehensive review ───────────────────────
    if (issueFlags.length >= 2) {
      const allProblemOrders = supplierOrders.filter(
        o =>
          (o.status === 'completed' || o.status === 'partial') &&
          (isLate(o) ||
            (o.receivedQuantity ?? o.orderedQuantity) < o.orderedQuantity ||
            o.qualityIssues.length > 0),
      );
      addRec({
        supplierId: supplier.id,
        productId: undefined,
        issueType: 'combined',
        priority: 'High',
        action: `Prioritise ${supplier.name} for a comprehensive procurement review covering delivery, quantity, and quality performance.`,
        evidence: [
          `Multiple issue types detected: ${issueFlags.join(', ')}`,
          `Reliability score: ${metrics.reliabilityScore.toFixed(1)} (${metrics.riskLevel} risk)`,
        ],
        poIds: allProblemOrders.map(o => o.id),
      });
    }

    // ── R5: Hidden issues ─────────────────────────────────────────────────────
    const supplierHidden = hiddenIssues.filter(h => h.supplierId === supplier.id);
    for (const hidden of supplierHidden) {
      const product = products.find(p => p.id === hidden.productId);
      const productName = product?.name ?? hidden.productId;
      const relevantOrders = supplierOrders.filter(
        o => o.productId === hidden.productId,
      );
      const problemOrders = relevantOrders.filter(
        o =>
          (o.status === 'completed' || o.status === 'partial') &&
          (hidden.issueType === 'delivery'
            ? isLate(o)
            : hidden.issueType === 'quantity'
            ? (o.receivedQuantity ?? o.orderedQuantity) < o.orderedQuantity
            : o.qualityIssues.length > 0),
      );

      addRec({
        supplierId: supplier.id,
        productId: hidden.productId,
        issueType: `hidden-${hidden.issueType}`,
        priority: hidden.severity === 'critical' ? 'High' : ('Medium' as RecommendationPriority),
        action:
          hidden.issueType === 'delivery'
            ? `Investigate why ${productName} deliveries from ${supplier.name} are consistently late even though overall delivery metrics appear acceptable.`
            : hidden.issueType === 'quantity'
            ? `Investigate recurring quantity shortfalls for ${productName} from ${supplier.name} — the product-level shortfall is hidden by overall supplier performance.`
            : `Inspect quality issues specifically affecting ${productName} from ${supplier.name} — product-level quality problems are masked by overall metrics.`,
        evidence: hidden.evidence,
        poIds: problemOrders.map(o => o.id),
      });
    }

    // ── R6: Good performance → routine monitoring ─────────────────────────────
    if (issueFlags.length === 0 && supplierHidden.length === 0 && metrics.reliabilityScore >= 85) {
      addRec({
        supplierId: supplier.id,
        productId: undefined,
        issueType: 'monitoring',
        priority: 'Low',
        action: `Continue routine monitoring of ${supplier.name}. Performance is consistently strong.`,
        evidence: [
          `Reliability score: ${metrics.reliabilityScore.toFixed(1)} (${metrics.riskLevel} risk)`,
          `On-time rate: ${metrics.onTimeRate.toFixed(1)}%`,
          `Quantity fulfilment: ${metrics.qtyFulfillmentRate.toFixed(1)}%`,
        ],
        poIds: [],
      });
    }
  }

  // Sort: High → Medium → Low
  const priorityOrder: Record<RecommendationPriority, number> = { High: 0, Medium: 1, Low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
