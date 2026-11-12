export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  country: string;
  category: string;
  activeFrom: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
}

export type QualityIssueType = 'damage' | 'defect' | 'wrong-item' | 'substandard';

export interface QualityIssue {
  type: QualityIssueType;
  description: string;
  batchAffected?: string;
}

export type POStatus = 'pending' | 'completed' | 'partial';

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  productId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  orderedQuantity: number;
  receivedQuantity?: number;
  status: POStatus;
  qualityIssues: QualityIssue[];
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskThresholds {
  critical: number;
  high: number;
  medium: number;
}

export interface SupplierMetrics {
  supplierId: string;
  totalOrders: number;
  completedOrders: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  pendingOrders: number;
  totalOrderedQty: number;
  totalReceivedQty: number;
  qualityIssueCount: number;
  onTimeRate: number;
  qtyFulfillmentRate: number;
  qualityPerformanceRate: number;
  reliabilityScore: number;
  riskLevel: RiskLevel;
}

export interface ProductMetrics {
  productId: string;
  supplierId: string;
  totalOrders: number;
  completedOrders: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  qualityIssues: number;
  onTimeRate: number;
  avgShortfallPct: number;
}

export type HiddenIssueType = 'delivery' | 'quantity' | 'quality' | 'combined';

export interface HiddenIssue {
  supplierId: string;
  productId: string;
  issueType: HiddenIssueType;
  severity: 'warning' | 'critical';
  evidence: string[];
  description: string;
}

export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface Recommendation {
  id: string;
  supplierId: string;
  productId?: string;
  issueType: string;
  priority: RecommendationPriority;
  action: string;
  evidence: string[];
  poIds: string[];
}
