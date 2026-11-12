import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { ArrowLeft, Mail, Globe, Calendar, Package, AlertTriangle, ExternalLink } from 'lucide-react';
import { suppliers, products, purchaseOrders } from '../data/procurement';
import { calcSupplierMetrics, calcProductMetrics, DEFAULT_THRESHOLDS } from '../utils/scoring';
import { detectHiddenIssues } from '../utils/issueDetection';
import { generateRecommendations } from '../utils/recommendations';
import { isLate, formatDateDisplay, parseDate } from '../utils/dateUtils';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import HiddenIssueCard from '../components/HiddenIssueCard';
import Header from '../components/layout/Header';

export default function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const supplier = suppliers.find(s => s.id === id);

  const supplierOrders = useMemo(
    () => purchaseOrders.filter(po => po.supplierId === id),
    [id],
  );

  const metrics = useMemo(
    () => supplier ? calcSupplierMetrics(supplier, supplierOrders, DEFAULT_THRESHOLDS) : null,
    [supplier, supplierOrders],
  );

  const productMetrics = useMemo(() => {
    if (!id) return [];
    return products
      .map(p => ({ product: p, metrics: calcProductMetrics(id, p.id, supplierOrders) }))
      .filter(({ metrics: m }) => m.totalOrders > 0);
  }, [id, supplierOrders]);

  const hiddenIssues = useMemo(
    () => detectHiddenIssues(suppliers, products, purchaseOrders, DEFAULT_THRESHOLDS).filter(h => h.supplierId === id),
    [id],
  );

  const recommendations = useMemo(
    () => generateRecommendations(suppliers, products, purchaseOrders, DEFAULT_THRESHOLDS).filter(r => r.supplierId === id),
    [id],
  );

  if (!supplier || !metrics) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/suppliers')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Back to Suppliers
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Supplier not found.</p>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: 'On-Time', value: parseFloat(metrics.onTimeRate.toFixed(1)) },
    { metric: 'Qty Fulfil', value: parseFloat(metrics.qtyFulfillmentRate.toFixed(1)) },
    { metric: 'Quality', value: parseFloat(metrics.qualityPerformanceRate.toFixed(1)) },
  ];

  const productBarData = productMetrics.map(({ product, metrics: m }) => ({
    name: product.name.split(' ')[0],
    fullName: product.name,
    onTimeRate: parseFloat(m.onTimeRate.toFixed(1)),
    orders: m.completedOrders,
  }));

  const PRIORITY_CLASSES: Record<string, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/suppliers')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Suppliers
      </button>

      <Header
        title={supplier.name}
        subtitle={`${supplier.category} · ${supplier.country}`}
        actions={<RiskBadge level={metrics.riskLevel} />}
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
          <Mail size={18} className="text-blue-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Contact</p>
            <p className="text-sm font-medium text-gray-800 truncate">{supplier.contactEmail}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
          <Globe size={18} className="text-green-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Country</p>
            <p className="text-sm font-medium text-gray-800">{supplier.country}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
          <Calendar size={18} className="text-purple-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Active Since</p>
            <p className="text-sm font-medium text-gray-800">{formatDateDisplay(parseDate(supplier.activeFrom))}</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total POs',       value: metrics.totalOrders },
          { label: 'On-Time Rate',    value: `${metrics.onTimeRate.toFixed(1)}%` },
          { label: 'Qty Fulfilment',  value: `${metrics.qtyFulfillmentRate.toFixed(1)}%` },
          { label: 'Quality Rate',    value: `${metrics.qualityPerformanceRate.toFixed(1)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick navigation links */}
      <div className="flex gap-3 flex-wrap mb-6">
        <Link
          to={`/purchase-orders?supplier=${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={14} /> View all Purchase Orders
        </Link>
        <Link
          to={`/recommendations?supplier=${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={14} /> View Recommendations
        </Link>
        <Link
          to={`/issue-analysis?supplier=${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={14} /> View Issue Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Radar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Performance Radar</h2>
          <p className="text-xs text-gray-500 mb-3">Reliability score: <span className="font-bold text-gray-800">{metrics.reliabilityScore.toFixed(1)}</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Product on-time bar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">On-Time Rate by Product</h2>
          {productBarData.length === 0 ? (
            <p className="text-sm text-gray-400">No completed orders.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <RTooltip
                  formatter={(v) => [`${v}%`, 'On-Time Rate']}
                  labelFormatter={(_, p) => p?.[0]?.payload?.fullName ?? ''}
                />
                <Bar dataKey="onTimeRate" radius={[4, 4, 0, 0]}>
                  {productBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.onTimeRate >= 85 ? '#22c55e' : entry.onTimeRate >= 70 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Hidden Issues */}
      {hiddenIssues.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            Hidden Product-Level Issues ({hiddenIssues.length})
          </h2>
          {hiddenIssues.map((issue, i) => {
            const prod = products.find(p => p.id === issue.productId);
            return (
              <HiddenIssueCard
                key={i}
                issue={issue}
                supplierName={supplier.name}
                productName={prod?.name ?? issue.productId}
              />
            );
          })}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map(rec => {
              const prod = rec.productId ? products.find(p => p.id === rec.productId) : null;
              return (
                <div key={rec.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${PRIORITY_CLASSES[rec.priority] ?? 'bg-gray-100 text-gray-700'}`}>
                          {rec.priority} Priority
                        </span>
                        {prod && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {prod.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800">{rec.action}</p>
                      <ul className="mt-2 space-y-1">
                        {rec.evidence.map((e, j) => (
                          <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                      {rec.poIds.length > 0 && (
                        <p className="mt-2 text-xs text-gray-400">{rec.poIds.length} supporting PO{rec.poIds.length > 1 ? 's' : ''}: {rec.poIds.slice(0, 5).join(', ')}{rec.poIds.length > 5 ? ` +${rec.poIds.length - 5} more` : ''}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product-Level Metrics Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Product-Level Metrics</h2>
          <p className="text-xs text-gray-500 mt-0.5">Completed and partial orders only</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">POs</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">On-Time %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Late</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Shortfall %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality Issues</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productMetrics.map(({ product, metrics: m }) => {
                const hasHidden = hiddenIssues.some(h => h.productId === product.id);
                return (
                  <tr key={product.id} className={hasHidden ? 'bg-red-50' : ''}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">
                      {product.name}
                      {hasHidden && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Hidden Issue</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{m.completedOrders}</td>
                    <td className={`px-4 py-2.5 text-right font-medium ${m.onTimeRate < 50 ? 'text-red-600' : m.onTimeRate < 85 ? 'text-yellow-700' : 'text-green-700'}`}>
                      {m.onTimeRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{m.lateDeliveries}</td>
                    <td className={`px-4 py-2.5 text-right ${m.avgShortfallPct > 5 ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
                      {m.avgShortfallPct.toFixed(1)}%
                    </td>
                    <td className={`px-4 py-2.5 text-right ${m.qualityIssues > 0 ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
                      {m.qualityIssues}
                    </td>
                    <td className="px-4 py-2.5">
                      {hasHidden ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-700 font-medium">
                          <AlertTriangle size={12} /> Review
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent PO Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Purchase Orders</h2>
          <span className="text-xs text-gray-500">{supplierOrders.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actual</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordered</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Received</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supplierOrders.map(po => {
                const prod = products.find(p => p.id === po.productId);
                const late = (po.status === 'completed' || po.status === 'partial') && isLate(po);
                return (
                  <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{po.id}</td>
                    <td className="px-4 py-2.5 text-gray-700">{prod?.name ?? po.productId}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatDateDisplay(parseDate(po.expectedDeliveryDate))}</td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {po.actualDeliveryDate ? formatDateDisplay(parseDate(po.actualDeliveryDate)) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{po.orderedQuantity}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{po.receivedQuantity ?? po.orderedQuantity}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={po.status} /></td>
                    <td className="px-4 py-2.5">
                      {po.status === 'pending' ? (
                        <span className="text-blue-600 text-xs">Awaiting</span>
                      ) : late ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Late</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">On Time</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
