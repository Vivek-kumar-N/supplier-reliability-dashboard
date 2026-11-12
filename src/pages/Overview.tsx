import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Building2, ShoppingCart, TrendingUp, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { suppliers, products, purchaseOrders } from '../data/procurement';
import {
  calcAllSupplierMetrics,
  DEFAULT_THRESHOLDS,
} from '../utils/scoring';
import { detectHiddenIssues } from '../utils/issueDetection';
import KPICard from '../components/KPICard';
import RiskBadge from '../components/RiskBadge';
import Header from '../components/layout/Header';
import type { RiskLevel } from '../types';

const RISK_COLORS: Record<RiskLevel, string> = {
  Low:      '#22c55e',
  Medium:   '#eab308',
  High:     '#f97316',
  Critical: '#ef4444',
};

const PIE_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

export default function Overview() {
  const navigate = useNavigate();

  const allMetrics = useMemo(
    () => calcAllSupplierMetrics(suppliers, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  const hiddenIssues = useMemo(
    () => detectHiddenIssues(suppliers, products, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  const avgScore = useMemo(() => {
    if (allMetrics.length === 0) return 0;
    return allMetrics.reduce((s, m) => s + m.reliabilityScore, 0) / allMetrics.length;
  }, [allMetrics]);

  // Data for the bar chart
  const barData = useMemo(
    () =>
      allMetrics.map(m => {
        const sup = suppliers.find(s => s.id === m.supplierId);
        return {
          name: sup?.name.split(' ')[0] ?? m.supplierId,
          fullName: sup?.name ?? m.supplierId,
          score: parseFloat(m.reliabilityScore.toFixed(1)),
          riskLevel: m.riskLevel,
          fill: RISK_COLORS[m.riskLevel],
        };
      }),
    [allMetrics],
  );

  // Data for pie chart
  const riskCounts = useMemo(() => {
    const counts: Record<RiskLevel, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    allMetrics.forEach(m => counts[m.riskLevel]++);
    return (['Low', 'Medium', 'High', 'Critical'] as RiskLevel[])
      .map((level, i) => ({ name: level, value: counts[level], color: PIE_COLORS[i] }))
      .filter(d => d.value > 0);
  }, [allMetrics]);

  return (
    <div className="max-w-7xl mx-auto">
      <Header
        title="Overview"
        subtitle="Supplier reliability at a glance — as of 12 Nov 2026"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Suppliers"
          value={suppliers.length}
          icon={Building2}
          iconColor="text-blue-500"
          tooltip="Number of active suppliers in the dataset"
        />
        <KPICard
          title="Total Purchase Orders"
          value={purchaseOrders.length}
          icon={ShoppingCart}
          iconColor="text-indigo-500"
          tooltip="All purchase orders across all suppliers"
        />
        <KPICard
          title="Avg Reliability Score"
          value={`${avgScore.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-green-500"
          subtitle="Weighted: delivery 40%, qty 35%, quality 25%"
          tooltip="Average weighted reliability score across all suppliers"
        />
        <KPICard
          title="Hidden Issues Detected"
          value={hiddenIssues.length}
          icon={AlertTriangle}
          iconColor="text-red-500"
          subtitle="Product-level issues masked by overall metrics"
          tooltip="Cases where a product has significantly worse performance than the supplier's overall score suggests"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Supplier Reliability Scores</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <RTooltip
                formatter={(value) => [`${value}%`, 'Reliability Score']}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ''
                }
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 flex-wrap">
            {(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map((level, i) => (
              <span key={level} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                {level}
              </span>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskCounts}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {riskCounts.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Suppliers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Country</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">POs</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">On-Time %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allMetrics.map(m => {
                const sup = suppliers.find(s => s.id === m.supplierId);
                return (
                  <tr
                    key={m.supplierId}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/suppliers/${m.supplierId}`)}
                  >
                    <td className="px-4 py-3 font-medium text-blue-700">{sup?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{sup?.country}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{m.totalOrders}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{m.onTimeRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{m.reliabilityScore.toFixed(1)}</td>
                    <td className="px-4 py-3"><RiskBadge level={m.riskLevel} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Issues Alert */}
      {hiddenIssues.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">
                {hiddenIssues.length} hidden product-level issue{hiddenIssues.length > 1 ? 's' : ''} detected
              </p>
              <p className="mt-1 text-sm text-red-700">
                Overall supplier scores look acceptable, but product-specific analysis reveals recurring problems that standard metrics don't surface.
              </p>
              <ul className="mt-2 space-y-1">
                {hiddenIssues.map((hi, i) => {
                  const sup = suppliers.find(s => s.id === hi.supplierId);
                  const prod = products.find(p => p.id === hi.productId);
                  return (
                    <li key={i} className="text-sm text-red-800">
                      •{' '}
                      <button
                        className="font-bold underline underline-offset-2 hover:text-red-600"
                        onClick={() => navigate(`/suppliers/${hi.supplierId}`)}
                      >
                        {sup?.name}
                      </button>
                      {' '}— {prod?.name}: {hi.description}
                    </li>
                  );
                })}
              </ul>
              <button
                className="mt-3 inline-flex items-center gap-1 text-sm text-red-700 font-semibold hover:text-red-900 underline underline-offset-2"
                onClick={() => navigate('/issue-analysis')}
              >
                View full Issue Analysis <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
