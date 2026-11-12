import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { AlertTriangle, TrendingDown, Package, Shield } from 'lucide-react';
import { suppliers, products, purchaseOrders } from '../data/procurement';
import { calcAllSupplierMetrics, DEFAULT_THRESHOLDS } from '../utils/scoring';
import {
  getMostDelayedSuppliers,
  getRecurringDelayProducts,
  getQuantityShortfallSuppliers,
  getQualityProblemSuppliers,
  detectHiddenIssues,
} from '../utils/issueDetection';
import Header from '../components/layout/Header';

const ALL = 'All';

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

export default function IssueAnalysis() {
  const [filterSupplier, setFilterSupplier] = useState(ALL);
  const [filterProduct, setFilterProduct] = useState(ALL);
  const [filterIssueType, setFilterIssueType] = useState(ALL);

  const allMetrics = useMemo(
    () => calcAllSupplierMetrics(suppliers, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  const delayedSuppliers = useMemo(() => getMostDelayedSuppliers(allMetrics), [allMetrics]);
  const recurringDelays = useMemo(
    () => getRecurringDelayProducts(suppliers, products, purchaseOrders),
    [],
  );
  const shortfallSuppliers = useMemo(
    () => getQuantityShortfallSuppliers(suppliers, allMetrics),
    [allMetrics],
  );
  const qualitySuppliers = useMemo(
    () => getQualityProblemSuppliers(suppliers, allMetrics),
    [allMetrics],
  );
  const hiddenIssues = useMemo(
    () => detectHiddenIssues(suppliers, products, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  // Heatmap: supplier × product, cell value = issue score
  const heatmapData = useMemo(() => {
    return suppliers.map(sup => {
      const row: Record<string, string | number> = { supplier: sup.name.split(' ')[0] };
      for (const prod of products) {
        const pos = purchaseOrders.filter(o => o.supplierId === sup.id && o.productId === prod.id);
        const done = pos.filter(o => o.status === 'completed' || o.status === 'partial');
        if (done.length === 0) { row[prod.id] = -1; continue; }
        const lateCount = done.filter(o => {
          return o.actualDeliveryDate ? o.actualDeliveryDate > o.expectedDeliveryDate : false;
        }).length;
        const qualityCount = done.filter(o => o.qualityIssues.length > 0).length;
        const shortCount = done.filter(o => (o.receivedQuantity ?? o.orderedQuantity) < o.orderedQuantity).length;
        const score = Math.round(((lateCount + qualityCount + shortCount) / done.length) * 100);
        row[prod.id] = score;
      }
      return row;
    });
  }, []);

  // Filtered recurring delays
  const filteredRecurring = useMemo(() => {
    return recurringDelays.filter(item => {
      if (filterSupplier !== ALL && item.supplier.id !== filterSupplier) return false;
      if (filterProduct !== ALL && item.product.id !== filterProduct) return false;
      return true;
    });
  }, [recurringDelays, filterSupplier, filterProduct]);

  // Filtered hidden issues
  const filteredHidden = useMemo(() => {
    return hiddenIssues.filter(h => {
      if (filterSupplier !== ALL && h.supplierId !== filterSupplier) return false;
      if (filterProduct !== ALL && h.productId !== filterProduct) return false;
      if (filterIssueType !== ALL && h.issueType !== filterIssueType) return false;
      return true;
    });
  }, [hiddenIssues, filterSupplier, filterProduct, filterIssueType]);

  const delayBarData = delayedSuppliers
    .filter(m => m.lateDeliveries > 0)
    .map(m => ({
      name: suppliers.find(s => s.id === m.supplierId)?.name.split(' ')[0] ?? m.supplierId,
      fullName: suppliers.find(s => s.id === m.supplierId)?.name ?? m.supplierId,
      late: m.lateDeliveries,
      onTimeRate: parseFloat(m.onTimeRate.toFixed(1)),
    }));

  const HEAT_COLORS = ['#f0fdf4', '#fef9c3', '#fed7aa', '#fca5a5', '#f87171'];
  function heatColor(score: number): string {
    if (score < 0) return '#f8fafc'; // no orders — gray
    if (score === 0) return HEAT_COLORS[0];
    if (score < 20) return HEAT_COLORS[1];
    if (score < 40) return HEAT_COLORS[2];
    if (score < 60) return HEAT_COLORS[3];
    return HEAT_COLORS[4];
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Header
        title="Issue Analysis"
        subtitle="Patterns that deserve attention — beyond raw numbers"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-sm text-gray-600 font-medium">Filter:</span>
        <select
          value={filterSupplier}
          onChange={e => setFilterSupplier(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Suppliers</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Products</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select
          value={filterIssueType}
          onChange={e => setFilterIssueType(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Issue Types</option>
          <option value="delivery">Delivery</option>
          <option value="quantity">Quantity</option>
          <option value="quality">Quality</option>
        </select>
      </div>

      {/* Top section: Most Delayed + Shortfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most delayed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingDown size={18} className="text-red-500" />
            Most Frequently Delayed Suppliers
          </h2>
          {delayBarData.length === 0 ? (
            <p className="text-sm text-gray-400">No delays recorded.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={delayBarData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <RTooltip
                  formatter={(v) => [v, 'Late Deliveries']}
                  labelFormatter={(_, p) => p?.[0]?.payload?.fullName ?? ''}
                />
                <Bar dataKey="late" radius={[0, 4, 4, 0]}>
                  {delayBarData.map((_, i) => (
                    <Cell key={i} fill="#f97316" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quantity shortfall */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Package size={18} className="text-orange-500" />
            Quantity Shortfall by Supplier
          </h2>
          {shortfallSuppliers.length === 0 ? (
            <p className="text-sm text-gray-400">No quantity shortfalls detected.</p>
          ) : (
            <div className="space-y-3">
              {shortfallSuppliers.map(({ supplier, metrics, shortfallPct }) => (
                <div key={supplier.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">{supplier.name}</span>
                    <span className="text-orange-600 font-semibold">{pct(shortfallPct)} shortfall</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-400"
                      style={{ width: `${Math.min(shortfallPct, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {metrics.totalReceivedQty.toLocaleString()} of {metrics.totalOrderedQty.toLocaleString()} units received
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quality Problems */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Shield size={18} className="text-red-500" />
          Suppliers with Quality Problems
        </h2>
        {qualitySuppliers.length === 0 ? (
          <p className="text-sm text-gray-400">No quality issues recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality Issues</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed POs</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {qualitySuppliers.map(({ supplier, metrics }) => {
                  const issueRate = metrics.completedOrders > 0
                    ? (metrics.qualityIssueCount / metrics.completedOrders) * 100
                    : 0;
                  return (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{supplier.name}</td>
                      <td className="px-4 py-2.5 text-right text-red-600 font-semibold">{metrics.qualityIssueCount}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{metrics.completedOrders}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${issueRate > 25 ? 'text-red-600' : 'text-orange-600'}`}>
                        {pct(issueRate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recurring Delay Products */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-yellow-500" />
          Products with Recurring Delivery Delays
          <span className="text-xs font-normal text-gray-500">(lateRate &gt;50%, ≥3 orders)</span>
        </h2>
        {filteredRecurring.length === 0 ? (
          <p className="text-sm text-gray-400">No recurring delay patterns found with the current filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Late Rate</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Orders</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Attention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecurring.map((item, i) => (
                  <tr key={i} className={item.lateRate >= 90 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{item.product.name}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.supplier.name}</td>
                    <td className={`px-4 py-2.5 text-right font-bold ${item.lateRate >= 90 ? 'text-red-600' : 'text-orange-600'}`}>
                      {pct(item.lateRate)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{item.orderCount}</td>
                    <td className="px-4 py-2.5">
                      {item.lateRate >= 90 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold">
                          <AlertTriangle size={12} /> Critical Pattern
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-700 font-medium">Recurring Issue</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product-Wise Issue Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 overflow-x-auto">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Product-Wise Issue Heatmap</h2>
        <p className="text-xs text-gray-500 mb-4">Issue score = % of completed orders with any issue (late, short, or quality). Darker = worse.</p>
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">Supplier</th>
              {products.map(p => (
                <th key={p.id} className="px-2 py-2 text-center text-gray-600 font-semibold max-w-16 truncate" title={p.name}>
                  {p.name.split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, si) => (
              <tr key={si}>
                <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{row.supplier as string}</td>
                {products.map(p => {
                  const val = row[p.id] as number;
                  return (
                    <td
                      key={p.id}
                      className="px-2 py-2 text-center rounded"
                      style={{ background: heatColor(val) }}
                      title={val < 0 ? 'No orders' : `${val}% issue rate`}
                    >
                      {val < 0 ? <span className="text-gray-300">—</span> : (
                        <span className={val >= 60 ? 'font-bold text-red-800' : val >= 40 ? 'font-semibold text-orange-700' : 'text-gray-700'}>
                          {val}%
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex gap-4 flex-wrap text-xs text-gray-500">
          {[['No issues', HEAT_COLORS[0]], ['<20%', HEAT_COLORS[1]], ['20–40%', HEAT_COLORS[2]], ['40–60%', HEAT_COLORS[3]], ['>60%', HEAT_COLORS[4]]].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border border-gray-200" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden Issues Section */}
      {filteredHidden.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            Hidden Product-Level Issues ({filteredHidden.length})
          </h2>
          <div className="space-y-3">
            {filteredHidden.map((issue, i) => {
              const sup = suppliers.find(s => s.id === issue.supplierId);
              const prod = products.find(p => p.id === issue.productId);
              return (
                <div
                  key={i}
                  className={`rounded-xl border-l-4 p-4 ${
                    issue.severity === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className={`mt-0.5 shrink-0 ${issue.severity === 'critical' ? 'text-red-500' : 'text-yellow-600'}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {sup?.name} — {prod?.name}
                      </p>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <ul className="mt-1 space-y-0.5">
                        {issue.evidence.map((e, j) => (
                          <li key={j} className="text-xs text-gray-600">• {e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
