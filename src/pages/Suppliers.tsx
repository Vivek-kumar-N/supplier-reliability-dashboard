import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Building2 } from 'lucide-react';
import { suppliers, purchaseOrders } from '../data/procurement';
import { calcAllSupplierMetrics, DEFAULT_THRESHOLDS } from '../utils/scoring';
import RiskBadge from '../components/RiskBadge';
import Header from '../components/layout/Header';
import type { RiskLevel } from '../types';

const ALL = 'All';

export default function Suppliers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | typeof ALL>(ALL);

  const allMetrics = useMemo(
    () => calcAllSupplierMetrics(suppliers, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  const rows = useMemo(() => {
    return allMetrics
      .map(m => ({ metrics: m, supplier: suppliers.find(s => s.id === m.supplierId)! }))
      .filter(({ supplier, metrics }) => {
        if (!supplier) return false;
        if (filterRisk !== ALL && metrics.riskLevel !== filterRisk) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          if (!supplier.name.toLowerCase().includes(q) && !supplier.country.toLowerCase().includes(q)) return false;
        }
        return true;
      });
  }, [allMetrics, search, filterRisk]);

  return (
    <div className="max-w-7xl mx-auto">
      <Header title="Suppliers" subtitle={`${rows.length} suppliers`} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value as RiskLevel | typeof ALL)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No suppliers match your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">POs</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">On-Time %</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty Fulfil %</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality %</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map(({ supplier, metrics }) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/suppliers/${supplier.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-blue-700">{supplier.name}</td>
                    <td className="px-4 py-3 text-gray-600">{supplier.country}</td>
                    <td className="px-4 py-3 text-gray-600">{supplier.category}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metrics.totalOrders}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metrics.onTimeRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metrics.qtyFulfillmentRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metrics.qualityPerformanceRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{metrics.reliabilityScore.toFixed(1)}</td>
                    <td className="px-4 py-3"><RiskBadge level={metrics.riskLevel} /></td>
                    <td className="px-4 py-3 text-gray-400"><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
