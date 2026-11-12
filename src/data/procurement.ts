import type { Supplier, Product, PurchaseOrder } from '../types';

// ─── Suppliers ───────────────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  {
    id: 'SUP001',
    name: 'GlobalTech Solutions',
    contactEmail: 'orders@globaltech.de',
    country: 'Germany',
    category: 'Electronics/IT',
    activeFrom: '2024-01-15',
  },
  {
    id: 'SUP002',
    name: 'PrimeParts Inc',
    contactEmail: 'supply@primeparts.com',
    country: 'USA',
    category: 'Industrial Equipment',
    activeFrom: '2024-03-01',
  },
  {
    id: 'SUP003',
    name: 'SwiftLogix',
    contactEmail: 'procurement@swiftlogix.sg',
    country: 'Singapore',
    category: 'Mixed',
    activeFrom: '2024-02-10',
  },
  {
    id: 'SUP004',
    name: 'AceProcure',
    contactEmail: 'sales@aceprocure.in',
    country: 'India',
    category: 'Mixed',
    activeFrom: '2024-04-01',
  },
  {
    id: 'SUP005',
    name: 'NorthStar Supplies',
    contactEmail: 'orders@northstar.ca',
    country: 'Canada',
    category: 'Safety/Furniture',
    activeFrom: '2024-01-20',
  },
  {
    id: 'SUP006',
    name: 'VendorX Global',
    contactEmail: 'biz@vendorx.cn',
    country: 'China',
    category: 'Mixed',
    activeFrom: '2024-05-01',
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  { id: 'PRD001', name: 'Laptop Batteries',  category: 'Electronics',  unit: 'units' },
  { id: 'PRD002', name: 'Office Chairs',      category: 'Furniture',    unit: 'units' },
  { id: 'PRD003', name: 'Printer Paper',      category: 'Stationery',   unit: 'reams' },
  { id: 'PRD004', name: 'Safety Helmets',     category: 'Safety',       unit: 'units' },
  { id: 'PRD005', name: 'Industrial Fans',    category: 'Equipment',    unit: 'units' },
  { id: 'PRD006', name: 'USB Cables',         category: 'Electronics',  unit: 'units' },
  { id: 'PRD007', name: 'Filing Cabinets',    category: 'Furniture',    unit: 'units' },
  { id: 'PRD008', name: 'Cleaning Supplies',  category: 'Consumables',  unit: 'liters' },
  { id: 'PRD009', name: 'Network Switches',   category: 'IT',           unit: 'units' },
  { id: 'PRD010', name: 'Packaging Tape',     category: 'Consumables',  unit: 'rolls' },
];

// ─── Purchase Orders ──────────────────────────────────────────────────────────
//
// SUP001 (GlobalTech) — Hidden-issue supplier
//   • PRD001 (Laptop Batteries): 12 POs, ≥10 late (hidden issue)
//   • PRD002, PRD006, PRD009 (other products): 18 POs, 85%+ on time
//   Net overall on-time ≈ 72–78% → Medium risk; PRD001 on-time ≈ 8%
//
// SUP002 (PrimeParts) — Frequent late deliveries + some quality issues
//   • PRD005 (Industrial Fans): 10 POs, 70% late, 2 quality issues
//   • PRD003 (Printer Paper): 10 POs, 60% on time
//
// SUP003 (SwiftLogix) — Consistently good (≥92% on time, full quantity)
//   • PRD003, PRD008, PRD010: 25 POs, all on time, full quantity
//
// SUP004 (AceProcure) — Recurring quality issues
//   • PRD004, PRD007, PRD008: 20 POs, 65% on time, 35% quality issues
//
// SUP005 (NorthStar) — Short deliveries + moderate lateness
//   • PRD002, PRD004, PRD007: 20 POs, 60% on time, 15% short
//
// SUP006 (VendorX) — Worst performer: very late, short, quality issues
//   • PRD005, PRD006, PRD010: 20 POs, 35% on time, 40% short, 20% quality

export const purchaseOrders: PurchaseOrder[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP001 — GlobalTech Solutions
  // PRD001: 12 POs — 11 late (hidden issue), 1 on time
  // ═══════════════════════════════════════════════════════════════════════════

  // Late PRD001 orders
  {
    id: 'PO-001', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-05-01', expectedDeliveryDate: '2026-05-15',
    actualDeliveryDate: '2026-06-10',
    orderedQuantity: 50, receivedQuantity: 50,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-002', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-05-10', expectedDeliveryDate: '2026-05-24',
    actualDeliveryDate: '2026-06-20',
    orderedQuantity: 60, receivedQuantity: 60,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-003', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-05-20', expectedDeliveryDate: '2026-06-03',
    actualDeliveryDate: '2026-07-01',
    orderedQuantity: 45, receivedQuantity: 45,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-004', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-06-01', expectedDeliveryDate: '2026-06-15',
    actualDeliveryDate: '2026-07-12',
    orderedQuantity: 55, receivedQuantity: 55,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-005', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-06-10', expectedDeliveryDate: '2026-06-24',
    actualDeliveryDate: '2026-07-25',
    orderedQuantity: 70, receivedQuantity: 70,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-006', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-06-20', expectedDeliveryDate: '2026-07-04',
    actualDeliveryDate: '2026-08-02',
    orderedQuantity: 50, receivedQuantity: 50,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-007', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-07-01', expectedDeliveryDate: '2026-07-15',
    actualDeliveryDate: '2026-08-18',
    orderedQuantity: 65, receivedQuantity: 65,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-008', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-07-10', expectedDeliveryDate: '2026-07-24',
    actualDeliveryDate: '2026-08-28',
    orderedQuantity: 60, receivedQuantity: 60,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-009', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-07-20', expectedDeliveryDate: '2026-08-03',
    actualDeliveryDate: '2026-09-05',
    orderedQuantity: 55, receivedQuantity: 55,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-010', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-08-01', expectedDeliveryDate: '2026-08-15',
    actualDeliveryDate: '2026-09-18',
    orderedQuantity: 70, receivedQuantity: 70,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-011', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-08-15', expectedDeliveryDate: '2026-08-29',
    actualDeliveryDate: '2026-09-30',
    orderedQuantity: 60, receivedQuantity: 60,
    status: 'completed', qualityIssues: [],
  },
  // 1 on-time PRD001 order
  {
    id: 'PO-012', supplierId: 'SUP001', productId: 'PRD001',
    orderDate: '2026-09-01', expectedDeliveryDate: '2026-09-15',
    actualDeliveryDate: '2026-09-14',
    orderedQuantity: 50, receivedQuantity: 50,
    status: 'completed', qualityIssues: [],
  },

  // PRD002 — Office Chairs (6 POs, 5 on time, 1 late)
  {
    id: 'PO-013', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-05-05', expectedDeliveryDate: '2026-05-19',
    actualDeliveryDate: '2026-05-18',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-014', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-06-05', expectedDeliveryDate: '2026-06-19',
    actualDeliveryDate: '2026-06-18',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-015', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-07-05', expectedDeliveryDate: '2026-07-19',
    actualDeliveryDate: '2026-07-17',
    orderedQuantity: 25, receivedQuantity: 25,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-016', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-08-05', expectedDeliveryDate: '2026-08-19',
    actualDeliveryDate: '2026-08-18',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-017', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-09-05', expectedDeliveryDate: '2026-09-19',
    actualDeliveryDate: '2026-09-25',
    orderedQuantity: 18, receivedQuantity: 18,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-018', supplierId: 'SUP001', productId: 'PRD002',
    orderDate: '2026-10-05', expectedDeliveryDate: '2026-10-19',
    actualDeliveryDate: '2026-10-18',
    orderedQuantity: 22, receivedQuantity: 22,
    status: 'completed', qualityIssues: [],
  },

  // PRD006 — USB Cables (6 POs, all on time)
  {
    id: 'PO-019', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-05-08', expectedDeliveryDate: '2026-05-22',
    actualDeliveryDate: '2026-05-21',
    orderedQuantity: 200, receivedQuantity: 200,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-020', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-06-08', expectedDeliveryDate: '2026-06-22',
    actualDeliveryDate: '2026-06-20',
    orderedQuantity: 150, receivedQuantity: 150,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-021', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-07-08', expectedDeliveryDate: '2026-07-22',
    actualDeliveryDate: '2026-07-21',
    orderedQuantity: 180, receivedQuantity: 180,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-022', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-08-08', expectedDeliveryDate: '2026-08-22',
    actualDeliveryDate: '2026-08-20',
    orderedQuantity: 160, receivedQuantity: 160,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-023', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-09-08', expectedDeliveryDate: '2026-09-22',
    actualDeliveryDate: '2026-09-21',
    orderedQuantity: 200, receivedQuantity: 200,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-024', supplierId: 'SUP001', productId: 'PRD006',
    orderDate: '2026-10-08', expectedDeliveryDate: '2026-10-22',
    actualDeliveryDate: '2026-10-21',
    orderedQuantity: 175, receivedQuantity: 175,
    status: 'completed', qualityIssues: [],
  },

  // PRD009 — Network Switches (6 POs, 5 on time, 1 late)
  {
    id: 'PO-025', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-05-12', expectedDeliveryDate: '2026-05-26',
    actualDeliveryDate: '2026-05-25',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-026', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-06-12', expectedDeliveryDate: '2026-06-26',
    actualDeliveryDate: '2026-06-25',
    orderedQuantity: 8, receivedQuantity: 8,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-027', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-07-12', expectedDeliveryDate: '2026-07-26',
    actualDeliveryDate: '2026-07-25',
    orderedQuantity: 12, receivedQuantity: 12,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-028', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-08-12', expectedDeliveryDate: '2026-08-26',
    actualDeliveryDate: '2026-08-28',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-029', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-09-12', expectedDeliveryDate: '2026-09-26',
    actualDeliveryDate: '2026-09-25',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-030', supplierId: 'SUP001', productId: 'PRD009',
    orderDate: '2026-10-12', expectedDeliveryDate: '2026-10-26',
    actualDeliveryDate: '2026-10-25',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP002 — PrimeParts Inc
  // PRD005: 10 POs — 7 late, 2 quality issues
  // PRD003: 10 POs — 6 on time (60%)
  // ═══════════════════════════════════════════════════════════════════════════

  // PRD005 — Industrial Fans (10 POs, 7 late, 2 quality)
  {
    id: 'PO-031', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-05-03', expectedDeliveryDate: '2026-05-20',
    actualDeliveryDate: '2026-06-05',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed',
    qualityIssues: [{ type: 'defect', description: 'Motor vibration on 2 units', batchAffected: 'B-001' }],
  },
  {
    id: 'PO-032', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-05-15', expectedDeliveryDate: '2026-06-01',
    actualDeliveryDate: '2026-06-25',
    orderedQuantity: 8, receivedQuantity: 8,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-033', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-06-01', expectedDeliveryDate: '2026-06-18',
    actualDeliveryDate: '2026-06-17',
    orderedQuantity: 12, receivedQuantity: 12,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-034', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-06-15', expectedDeliveryDate: '2026-07-02',
    actualDeliveryDate: '2026-07-28',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-035', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-07-01', expectedDeliveryDate: '2026-07-18',
    actualDeliveryDate: '2026-08-10',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed',
    qualityIssues: [{ type: 'substandard', description: 'Below-spec performance on 3 units', batchAffected: 'B-002' }],
  },
  {
    id: 'PO-036', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-07-15', expectedDeliveryDate: '2026-08-01',
    actualDeliveryDate: '2026-08-28',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-037', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-08-01', expectedDeliveryDate: '2026-08-18',
    actualDeliveryDate: '2026-08-17',
    orderedQuantity: 8, receivedQuantity: 8,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-038', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-08-15', expectedDeliveryDate: '2026-09-01',
    actualDeliveryDate: '2026-09-25',
    orderedQuantity: 12, receivedQuantity: 12,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-039', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-09-01', expectedDeliveryDate: '2026-09-18',
    actualDeliveryDate: '2026-10-10',
    orderedQuantity: 10, receivedQuantity: 10,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-040', supplierId: 'SUP002', productId: 'PRD005',
    orderDate: '2026-09-15', expectedDeliveryDate: '2026-10-02',
    actualDeliveryDate: '2026-10-30',
    orderedQuantity: 8, receivedQuantity: 8,
    status: 'completed', qualityIssues: [],
  },

  // PRD003 — Printer Paper (10 POs, 6 on time)
  {
    id: 'PO-041', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-05-05', expectedDeliveryDate: '2026-05-19',
    actualDeliveryDate: '2026-05-18',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-042', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-05-20', expectedDeliveryDate: '2026-06-03',
    actualDeliveryDate: '2026-06-15',
    orderedQuantity: 80, receivedQuantity: 80,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-043', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-06-05', expectedDeliveryDate: '2026-06-19',
    actualDeliveryDate: '2026-06-18',
    orderedQuantity: 120, receivedQuantity: 120,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-044', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-06-20', expectedDeliveryDate: '2026-07-04',
    actualDeliveryDate: '2026-07-20',
    orderedQuantity: 90, receivedQuantity: 90,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-045', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-07-05', expectedDeliveryDate: '2026-07-19',
    actualDeliveryDate: '2026-07-18',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-046', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-07-20', expectedDeliveryDate: '2026-08-03',
    actualDeliveryDate: '2026-08-02',
    orderedQuantity: 110, receivedQuantity: 110,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-047', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-08-05', expectedDeliveryDate: '2026-08-19',
    actualDeliveryDate: '2026-09-02',
    orderedQuantity: 80, receivedQuantity: 80,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-048', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-08-20', expectedDeliveryDate: '2026-09-03',
    actualDeliveryDate: '2026-09-02',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-049', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-09-05', expectedDeliveryDate: '2026-09-19',
    actualDeliveryDate: '2026-09-30',
    orderedQuantity: 90, receivedQuantity: 90,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-050', supplierId: 'SUP002', productId: 'PRD003',
    orderDate: '2026-09-20', expectedDeliveryDate: '2026-10-04',
    actualDeliveryDate: '2026-10-03',
    orderedQuantity: 120, receivedQuantity: 120,
    status: 'completed', qualityIssues: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP003 — SwiftLogix (consistently good, ≥92% on time)
  // PRD003: 9, PRD008: 8, PRD010: 8 = 25 POs
  // ═══════════════════════════════════════════════════════════════════════════

  // PRD003 — Printer Paper (9 POs, all on time)
  {
    id: 'PO-051', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-05-02', expectedDeliveryDate: '2026-05-16',
    actualDeliveryDate: '2026-05-15',
    orderedQuantity: 200, receivedQuantity: 200,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-052', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-05-20', expectedDeliveryDate: '2026-06-03',
    actualDeliveryDate: '2026-06-02',
    orderedQuantity: 180, receivedQuantity: 180,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-053', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-06-10', expectedDeliveryDate: '2026-06-24',
    actualDeliveryDate: '2026-06-23',
    orderedQuantity: 220, receivedQuantity: 220,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-054', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-07-01', expectedDeliveryDate: '2026-07-15',
    actualDeliveryDate: '2026-07-14',
    orderedQuantity: 200, receivedQuantity: 200,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-055', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-07-20', expectedDeliveryDate: '2026-08-03',
    actualDeliveryDate: '2026-08-02',
    orderedQuantity: 190, receivedQuantity: 190,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-056', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-08-10', expectedDeliveryDate: '2026-08-24',
    actualDeliveryDate: '2026-08-23',
    orderedQuantity: 210, receivedQuantity: 210,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-057', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-09-01', expectedDeliveryDate: '2026-09-15',
    actualDeliveryDate: '2026-09-14',
    orderedQuantity: 200, receivedQuantity: 200,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-058', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-09-20', expectedDeliveryDate: '2026-10-04',
    actualDeliveryDate: '2026-10-03',
    orderedQuantity: 180, receivedQuantity: 180,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-059', supplierId: 'SUP003', productId: 'PRD003',
    orderDate: '2026-10-10', expectedDeliveryDate: '2026-10-24',
    actualDeliveryDate: '2026-10-23',
    orderedQuantity: 220, receivedQuantity: 220,
    status: 'completed', qualityIssues: [],
  },

  // PRD008 — Cleaning Supplies (8 POs, all on time)
  {
    id: 'PO-060', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-05-05', expectedDeliveryDate: '2026-05-19',
    actualDeliveryDate: '2026-05-18',
    orderedQuantity: 500, receivedQuantity: 500,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-061', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-06-05', expectedDeliveryDate: '2026-06-19',
    actualDeliveryDate: '2026-06-18',
    orderedQuantity: 480, receivedQuantity: 480,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-062', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-07-05', expectedDeliveryDate: '2026-07-19',
    actualDeliveryDate: '2026-07-18',
    orderedQuantity: 520, receivedQuantity: 520,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-063', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-08-05', expectedDeliveryDate: '2026-08-19',
    actualDeliveryDate: '2026-08-18',
    orderedQuantity: 500, receivedQuantity: 500,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-064', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-08-20', expectedDeliveryDate: '2026-09-03',
    actualDeliveryDate: '2026-09-02',
    orderedQuantity: 490, receivedQuantity: 490,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-065', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-09-05', expectedDeliveryDate: '2026-09-19',
    actualDeliveryDate: '2026-09-18',
    orderedQuantity: 510, receivedQuantity: 510,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-066', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-09-25', expectedDeliveryDate: '2026-10-09',
    actualDeliveryDate: '2026-10-08',
    orderedQuantity: 500, receivedQuantity: 500,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-067', supplierId: 'SUP003', productId: 'PRD008',
    orderDate: '2026-10-15', expectedDeliveryDate: '2026-10-29',
    actualDeliveryDate: '2026-10-28',
    orderedQuantity: 480, receivedQuantity: 480,
    status: 'completed', qualityIssues: [],
  },

  // PRD010 — Packaging Tape (8 POs, all on time)
  {
    id: 'PO-068', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-05-08', expectedDeliveryDate: '2026-05-22',
    actualDeliveryDate: '2026-05-21',
    orderedQuantity: 300, receivedQuantity: 300,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-069', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-06-08', expectedDeliveryDate: '2026-06-22',
    actualDeliveryDate: '2026-06-21',
    orderedQuantity: 280, receivedQuantity: 280,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-070', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-07-08', expectedDeliveryDate: '2026-07-22',
    actualDeliveryDate: '2026-07-21',
    orderedQuantity: 320, receivedQuantity: 320,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-071', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-08-08', expectedDeliveryDate: '2026-08-22',
    actualDeliveryDate: '2026-08-21',
    orderedQuantity: 300, receivedQuantity: 300,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-072', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-08-25', expectedDeliveryDate: '2026-09-08',
    actualDeliveryDate: '2026-09-07',
    orderedQuantity: 290, receivedQuantity: 290,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-073', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-09-10', expectedDeliveryDate: '2026-09-24',
    actualDeliveryDate: '2026-09-23',
    orderedQuantity: 310, receivedQuantity: 310,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-074', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-10-01', expectedDeliveryDate: '2026-10-15',
    actualDeliveryDate: '2026-10-14',
    orderedQuantity: 300, receivedQuantity: 300,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-075', supplierId: 'SUP003', productId: 'PRD010',
    orderDate: '2026-10-20', expectedDeliveryDate: '2026-11-03',
    actualDeliveryDate: '2026-11-02',
    orderedQuantity: 280, receivedQuantity: 280,
    status: 'completed', qualityIssues: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP004 — AceProcure (recurring quality issues)
  // PRD004: 7, PRD007: 7, PRD008: 6 = 20 POs, 65% on time, 35% quality issues
  // ═══════════════════════════════════════════════════════════════════════════

  // PRD004 — Safety Helmets (7 POs, 5 on time, 2 quality issues)
  {
    id: 'PO-076', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-05-03', expectedDeliveryDate: '2026-05-17',
    actualDeliveryDate: '2026-05-16',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed',
    qualityIssues: [{ type: 'substandard', description: 'Non-compliant padding on 15 helmets', batchAffected: 'AH-001' }],
  },
  {
    id: 'PO-077', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-06-03', expectedDeliveryDate: '2026-06-17',
    actualDeliveryDate: '2026-06-30',
    orderedQuantity: 80, receivedQuantity: 80,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-078', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-07-03', expectedDeliveryDate: '2026-07-17',
    actualDeliveryDate: '2026-07-16',
    orderedQuantity: 90, receivedQuantity: 90,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-079', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-07-20', expectedDeliveryDate: '2026-08-03',
    actualDeliveryDate: '2026-08-02',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed',
    qualityIssues: [{ type: 'defect', description: 'Cracked chin straps on 8 helmets', batchAffected: 'AH-002' }],
  },
  {
    id: 'PO-080', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-08-10', expectedDeliveryDate: '2026-08-24',
    actualDeliveryDate: '2026-09-05',
    orderedQuantity: 85, receivedQuantity: 85,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-081', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-09-10', expectedDeliveryDate: '2026-09-24',
    actualDeliveryDate: '2026-09-23',
    orderedQuantity: 95, receivedQuantity: 95,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-082', supplierId: 'SUP004', productId: 'PRD004',
    orderDate: '2026-10-10', expectedDeliveryDate: '2026-10-24',
    actualDeliveryDate: '2026-10-23',
    orderedQuantity: 100, receivedQuantity: 100,
    status: 'completed', qualityIssues: [],
  },

  // PRD007 — Filing Cabinets (7 POs, 4 on time, 3 quality issues)
  {
    id: 'PO-083', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-05-05', expectedDeliveryDate: '2026-05-19',
    actualDeliveryDate: '2026-05-18',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed',
    qualityIssues: [{ type: 'damage', description: 'Dented panels on 4 units', batchAffected: 'AFC-001' }],
  },
  {
    id: 'PO-084', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-06-05', expectedDeliveryDate: '2026-06-19',
    actualDeliveryDate: '2026-07-02',
    orderedQuantity: 18, receivedQuantity: 18,
    status: 'completed',
    qualityIssues: [{ type: 'defect', description: 'Faulty drawer locks on 3 units', batchAffected: 'AFC-002' }],
  },
  {
    id: 'PO-085', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-07-05', expectedDeliveryDate: '2026-07-19',
    actualDeliveryDate: '2026-07-18',
    orderedQuantity: 22, receivedQuantity: 22,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-086', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-08-05', expectedDeliveryDate: '2026-08-19',
    actualDeliveryDate: '2026-08-18',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-087', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-08-25', expectedDeliveryDate: '2026-09-08',
    actualDeliveryDate: '2026-09-22',
    orderedQuantity: 25, receivedQuantity: 25,
    status: 'completed',
    qualityIssues: [{ type: 'damage', description: 'Scratched surfaces on 5 units', batchAffected: 'AFC-003' }],
  },
  {
    id: 'PO-088', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-09-15', expectedDeliveryDate: '2026-09-29',
    actualDeliveryDate: '2026-09-28',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-089', supplierId: 'SUP004', productId: 'PRD007',
    orderDate: '2026-10-15', expectedDeliveryDate: '2026-10-29',
    actualDeliveryDate: '2026-10-28',
    orderedQuantity: 18, receivedQuantity: 18,
    status: 'completed', qualityIssues: [],
  },

  // PRD008 — Cleaning Supplies (6 POs, 4 on time, 2 quality issues)
  {
    id: 'PO-090', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-05-10', expectedDeliveryDate: '2026-05-24',
    actualDeliveryDate: '2026-05-23',
    orderedQuantity: 300, receivedQuantity: 300,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-091', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-06-10', expectedDeliveryDate: '2026-06-24',
    actualDeliveryDate: '2026-07-05',
    orderedQuantity: 280, receivedQuantity: 280,
    status: 'completed',
    qualityIssues: [{ type: 'substandard', description: 'Below-concentration cleaning solution', batchAffected: 'ACS-001' }],
  },
  {
    id: 'PO-092', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-07-10', expectedDeliveryDate: '2026-07-24',
    actualDeliveryDate: '2026-07-23',
    orderedQuantity: 320, receivedQuantity: 320,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-093', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-08-10', expectedDeliveryDate: '2026-08-24',
    actualDeliveryDate: '2026-08-23',
    orderedQuantity: 300, receivedQuantity: 300,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-094', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-09-10', expectedDeliveryDate: '2026-09-24',
    actualDeliveryDate: '2026-10-05',
    orderedQuantity: 290, receivedQuantity: 290,
    status: 'completed',
    qualityIssues: [{ type: 'wrong-item', description: 'Wrong product variant shipped' }],
  },
  {
    id: 'PO-095', supplierId: 'SUP004', productId: 'PRD008',
    orderDate: '2026-10-10', expectedDeliveryDate: '2026-10-24',
    actualDeliveryDate: '2026-10-23',
    orderedQuantity: 310, receivedQuantity: 310,
    status: 'completed', qualityIssues: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP005 — NorthStar Supplies (short deliveries + lateness)
  // PRD002: 7, PRD004: 7, PRD007: 6 = 20 POs, 60% on time, 15% short
  // ═══════════════════════════════════════════════════════════════════════════

  // PRD002 — Office Chairs (7 POs, 4 on time, 2 short, 1 quality)
  {
    id: 'PO-096', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-05-04', expectedDeliveryDate: '2026-05-18',
    actualDeliveryDate: '2026-05-30',
    orderedQuantity: 30, receivedQuantity: 30,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-097', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-06-04', expectedDeliveryDate: '2026-06-18',
    actualDeliveryDate: '2026-06-17',
    orderedQuantity: 25, receivedQuantity: 20,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-098', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-07-04', expectedDeliveryDate: '2026-07-18',
    actualDeliveryDate: '2026-07-17',
    orderedQuantity: 28, receivedQuantity: 28,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-099', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-07-25', expectedDeliveryDate: '2026-08-08',
    actualDeliveryDate: '2026-08-20',
    orderedQuantity: 30, receivedQuantity: 30,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-100', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-08-15', expectedDeliveryDate: '2026-08-29',
    actualDeliveryDate: '2026-08-28',
    orderedQuantity: 25, receivedQuantity: 18,
    status: 'partial',
    qualityIssues: [{ type: 'damage', description: 'Torn upholstery on 3 chairs' }],
  },
  {
    id: 'PO-101', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-09-15', expectedDeliveryDate: '2026-09-29',
    actualDeliveryDate: '2026-09-28',
    orderedQuantity: 30, receivedQuantity: 30,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-102', supplierId: 'SUP005', productId: 'PRD002',
    orderDate: '2026-10-15', expectedDeliveryDate: '2026-10-29',
    actualDeliveryDate: '2026-10-28',
    orderedQuantity: 28, receivedQuantity: 28,
    status: 'completed', qualityIssues: [],
  },

  // PRD004 — Safety Helmets (7 POs, 4 on time, 1 short)
  {
    id: 'PO-103', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-05-06', expectedDeliveryDate: '2026-05-20',
    actualDeliveryDate: '2026-06-01',
    orderedQuantity: 60, receivedQuantity: 60,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-104', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-06-06', expectedDeliveryDate: '2026-06-20',
    actualDeliveryDate: '2026-06-19',
    orderedQuantity: 50, receivedQuantity: 50,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-105', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-07-06', expectedDeliveryDate: '2026-07-20',
    actualDeliveryDate: '2026-08-01',
    orderedQuantity: 55, receivedQuantity: 42,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-106', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-08-06', expectedDeliveryDate: '2026-08-20',
    actualDeliveryDate: '2026-08-19',
    orderedQuantity: 60, receivedQuantity: 60,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-107', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-08-28', expectedDeliveryDate: '2026-09-11',
    actualDeliveryDate: '2026-09-25',
    orderedQuantity: 50, receivedQuantity: 50,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-108', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-09-18', expectedDeliveryDate: '2026-10-02',
    actualDeliveryDate: '2026-10-01',
    orderedQuantity: 65, receivedQuantity: 65,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-109', supplierId: 'SUP005', productId: 'PRD004',
    orderDate: '2026-10-10', expectedDeliveryDate: '2026-10-24',
    actualDeliveryDate: '2026-10-23',
    orderedQuantity: 55, receivedQuantity: 55,
    status: 'completed', qualityIssues: [],
  },

  // PRD007 — Filing Cabinets (6 POs, 4 on time)
  {
    id: 'PO-110', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-05-08', expectedDeliveryDate: '2026-05-22',
    actualDeliveryDate: '2026-06-02',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-111', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-06-08', expectedDeliveryDate: '2026-06-22',
    actualDeliveryDate: '2026-06-21',
    orderedQuantity: 12, receivedQuantity: 12,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-112', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-07-08', expectedDeliveryDate: '2026-07-22',
    actualDeliveryDate: '2026-07-21',
    orderedQuantity: 18, receivedQuantity: 18,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-113', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-08-08', expectedDeliveryDate: '2026-08-22',
    actualDeliveryDate: '2026-09-05',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-114', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-09-08', expectedDeliveryDate: '2026-09-22',
    actualDeliveryDate: '2026-09-21',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-115', supplierId: 'SUP005', productId: 'PRD007',
    orderDate: '2026-10-08', expectedDeliveryDate: '2026-10-22',
    actualDeliveryDate: '2026-10-21',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUP006 — VendorX Global (worst performer — Critical risk)
  // PRD005: 7, PRD006: 7, PRD010: 6 = 20 POs
  // Target: OTR ≈ 35%, QFR ≈ 55%, QPR ≈ 65% → score ≈ 49.5 (Critical <50)
  // 7 on time, 13 late; 8 orders with heavy shortfalls; 7 quality issues
  // ═══════════════════════════════════════════════════════════════════════════

  // PRD005 — Industrial Fans (7 POs, 2 on time, 4 short, 3 quality)
  {
    id: 'PO-116', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-05-05', expectedDeliveryDate: '2026-05-22',
    actualDeliveryDate: '2026-06-15',
    orderedQuantity: 20, receivedQuantity: 8,
    status: 'partial',
    qualityIssues: [{ type: 'defect', description: 'Faulty wiring on 2 units', batchAffected: 'VX-001' }],
  },
  {
    id: 'PO-117', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-05-25', expectedDeliveryDate: '2026-06-11',
    actualDeliveryDate: '2026-07-05',
    orderedQuantity: 15, receivedQuantity: 15,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-118', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-06-15', expectedDeliveryDate: '2026-07-02',
    actualDeliveryDate: '2026-07-01',
    orderedQuantity: 20, receivedQuantity: 7,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-119', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-07-05', expectedDeliveryDate: '2026-07-22',
    actualDeliveryDate: '2026-08-20',
    orderedQuantity: 20, receivedQuantity: 20,
    status: 'completed',
    qualityIssues: [{ type: 'substandard', description: 'Below-specification airflow on 6 units', batchAffected: 'VX-002' }],
  },
  {
    id: 'PO-120', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-07-25', expectedDeliveryDate: '2026-08-11',
    actualDeliveryDate: '2026-09-10',
    orderedQuantity: 15, receivedQuantity: 5,
    status: 'partial',
    qualityIssues: [{ type: 'damage', description: 'Physical damage to 3 units in transit', batchAffected: 'VX-004' }],
  },
  {
    id: 'PO-121', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-08-15', expectedDeliveryDate: '2026-09-01',
    actualDeliveryDate: '2026-10-05',
    orderedQuantity: 20, receivedQuantity: 6,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-122', supplierId: 'SUP006', productId: 'PRD005',
    orderDate: '2026-09-05', expectedDeliveryDate: '2026-09-22',
    actualDeliveryDate: '2026-10-20',
    orderedQuantity: 18, receivedQuantity: 18,
    status: 'completed', qualityIssues: [],
  },

  // PRD006 — USB Cables (7 POs, 3 on time, 3 short, 2 quality)
  {
    id: 'PO-123', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-05-08', expectedDeliveryDate: '2026-05-25',
    actualDeliveryDate: '2026-06-20',
    orderedQuantity: 500, receivedQuantity: 180,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-124', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-06-01', expectedDeliveryDate: '2026-06-18',
    actualDeliveryDate: '2026-06-17',
    orderedQuantity: 400, receivedQuantity: 400,
    status: 'completed',
    qualityIssues: [{ type: 'defect', description: 'Frayed cable sheathing on 80 units', batchAffected: 'VX-003' }],
  },
  {
    id: 'PO-125', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-06-20', expectedDeliveryDate: '2026-07-07',
    actualDeliveryDate: '2026-08-01',
    orderedQuantity: 450, receivedQuantity: 100,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-126', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-07-10', expectedDeliveryDate: '2026-07-27',
    actualDeliveryDate: '2026-07-26',
    orderedQuantity: 500, receivedQuantity: 150,
    status: 'partial',
    qualityIssues: [{ type: 'wrong-item', description: 'Wrong cable type shipped for 100 units' }],
  },
  {
    id: 'PO-127', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-08-01', expectedDeliveryDate: '2026-08-18',
    actualDeliveryDate: '2026-09-15',
    orderedQuantity: 400, receivedQuantity: 400,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-128', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-08-20', expectedDeliveryDate: '2026-09-06',
    actualDeliveryDate: '2026-10-10',
    orderedQuantity: 500, receivedQuantity: 160,
    status: 'partial', qualityIssues: [],
  },
  {
    id: 'PO-129', supplierId: 'SUP006', productId: 'PRD006',
    orderDate: '2026-09-10', expectedDeliveryDate: '2026-09-27',
    actualDeliveryDate: '2026-10-25',
    orderedQuantity: 450, receivedQuantity: 450,
    status: 'completed', qualityIssues: [],
  },

  // PRD010 — Packaging Tape (6 POs, 2 on time, 1 short, 2 quality)
  {
    id: 'PO-130', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-05-10', expectedDeliveryDate: '2026-05-27',
    actualDeliveryDate: '2026-06-25',
    orderedQuantity: 600, receivedQuantity: 600,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-131', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-06-10', expectedDeliveryDate: '2026-06-27',
    actualDeliveryDate: '2026-06-26',
    orderedQuantity: 500, receivedQuantity: 500,
    status: 'completed',
    qualityIssues: [{ type: 'substandard', description: 'Poor adhesive quality on 200 rolls', batchAffected: 'VX-005' }],
  },
  {
    id: 'PO-132', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-07-10', expectedDeliveryDate: '2026-07-27',
    actualDeliveryDate: '2026-08-25',
    orderedQuantity: 600, receivedQuantity: 600,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-133', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-08-10', expectedDeliveryDate: '2026-08-27',
    actualDeliveryDate: '2026-09-30',
    orderedQuantity: 550, receivedQuantity: 150,
    status: 'partial',
    qualityIssues: [{ type: 'damage', description: 'Rolls crushed in transit — unusable' }],
  },
  {
    id: 'PO-134', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-09-10', expectedDeliveryDate: '2026-09-27',
    actualDeliveryDate: '2026-10-30',
    orderedQuantity: 600, receivedQuantity: 600,
    status: 'completed', qualityIssues: [],
  },
  {
    id: 'PO-135', supplierId: 'SUP006', productId: 'PRD010',
    orderDate: '2026-10-10', expectedDeliveryDate: '2026-10-27',
    actualDeliveryDate: '2026-11-10',
    orderedQuantity: 500, receivedQuantity: 500,
    status: 'completed', qualityIssues: [],
  },
];
