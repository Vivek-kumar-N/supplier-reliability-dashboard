import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lightbulb, ChevronRight, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { suppliers, products, purchaseOrders } from '../data/procurement';
import { generateRecommendations } from '../utils/recommendations';
import { DEFAULT_THRESHOLDS } from '../utils/scoring';
import Header from '../components/layout/Header';
import type { RecommendationPriority } from '../types';

const ALL = 'All';

const PRIORITY_CONFIG: Record<RecommendationPriority, { classes: string; icon: React.ComponentType<{ size: number; className?: string }> }> = {
  High:   { classes: 'bg-red-100 text-red-800 border-red-200',      icon: AlertCircle },
  Medium: { classes: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
  Low:    { classes: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
};

const ISSUE_TYPE_LABELS: Record<string, string> = {
  'delivery':         'Late Delivery',
  'quantity':         'Quantity Shortfall',
  'quality':          'Quality Issues',
  'combined':         'Multiple Issues',
  'hidden-delivery':  'Hidden Delivery Issue',
  'hidden-quantity':  'Hidden Quantity Issue',
  'hidden-quality':   'Hidden Quality Issue',
  'monitoring':       'Routine Monitoring',
};

export default function Recommendations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterPriority = (searchParams.get('priority') ?? ALL) as RecommendationPriority | typeof ALL;
  const filterSupplier = searchParams.get('supplier') ?? ALL;

  function setParam(key: string, value: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === ALL) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams());
  }

  const allRecs = useMemo(
    () => generateRecommendations(suppliers, products, purchaseOrders, DEFAULT_THRESHOLDS),
    [],
  );

  const filtered = useMemo(() => {
    return allRecs.filter(r => {
      if (filterPriority !== ALL && r.priority !== filterPriority) return false;
      if (filterSupplier !== ALL && r.supplierId !== filterSupplier) return false;
      return true;
    });
  }, [allRecs, filterPriority, filterSupplier]);

  const counts = useMemo(() => {
    const c: Record<RecommendationPriority | 'total', number> = { total: allRecs.length, High: 0, Medium: 0, Low: 0 };
    allRecs.forEach(r => c[r.priority]++);
    return c;
  }, [allRecs]);

  return (
    <div className="max-w-5xl mx-auto">
      <Header
        title="Recommendations"
        subtitle="Rule-based, evidence-backed actions derived from purchase order data"
      />

      {/* Summary badges */}
      <div className="flex gap-3 flex-wrap mb-6">
        {(['High', 'Medium', 'Low'] as RecommendationPriority[]).map(p => {
          const { classes, icon: Icon } = PRIORITY_CONFIG[p];
          return (
            <div key={p} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${classes}`}>
              <Icon size={16} className="" />
              {counts[p]} {p} Priority
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-sm text-gray-600 font-medium">Filter:</span>
        <select
          value={filterPriority}
          onChange={e => setParam('priority', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterSupplier}
          onChange={e => setParam('supplier', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={ALL}>All Suppliers</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {(filterPriority !== ALL || filterSupplier !== ALL) && (
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Lightbulb size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No recommendations match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rec => {
            const sup = suppliers.find(s => s.id === rec.supplierId);
            const prod = rec.productId ? products.find(p => p.id === rec.productId) : null;
            const { classes, icon: Icon } = PRIORITY_CONFIG[rec.priority];
            const issueLabel = ISSUE_TYPE_LABELS[rec.issueType] ?? rec.issueType;

            return (
              <div key={rec.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-lg border ${classes} shrink-0`}>
                    <Icon size={18} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${classes}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {issueLabel}
                        </span>
                        <span className="text-xs font-mono text-gray-400">{rec.id}</span>
                      </div>
                    </div>

                    {/* Supplier + product */}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Supplier: </span>
                        <button
                          className="font-semibold text-blue-700 hover:underline"
                          onClick={() => navigate(`/suppliers/${rec.supplierId}`)}
                        >
                          {sup?.name ?? rec.supplierId}
                        </button>
                      </div>
                      {prod && (
                        <div>
                          <span className="text-gray-500">Product: </span>
                          <span className="font-semibold text-gray-800">{prod.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <p className="mt-3 text-sm font-medium text-gray-900">{rec.action}</p>

                    {/* Evidence */}
                    {rec.evidence.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Supporting Evidence</p>
                        <ul className="space-y-1">
                          {rec.evidence.map((e, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* PO Links */}
                    {rec.poIds.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-gray-500">Traceable POs ({rec.poIds.length}):</span>
                        {rec.poIds.slice(0, 6).map(id => (
                          <span key={id} className="text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{id}</span>
                        ))}
                        {rec.poIds.length > 6 && (
                          <span className="text-xs text-gray-400">+{rec.poIds.length - 6} more</span>
                        )}
                      </div>
                    )}

                    {/* Navigate to supplier */}
                    <button
                      className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      onClick={() => navigate(`/suppliers/${rec.supplierId}`)}
                    >
                      View {sup?.name} profile <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
