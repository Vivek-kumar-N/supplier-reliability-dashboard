import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { suppliers, products, purchaseOrders } from '../data/procurement';
import { isLate } from '../utils/dateUtils';
import { formatDateDisplay, parseDate } from '../utils/dateUtils';
import StatusBadge from '../components/StatusBadge';
import Header from '../components/layout/Header';
import type { POStatus } from '../types';

const ALL = 'All';

export default function PurchaseOrders() {
  const [search, setSearch] = useState('');
  const [filterSupplier, setFilterSupplier] = useState(ALL);
  const [filterProduct, setFilterProduct] = useState(ALL);
  const [filterStatus, setFilterStatus] = useState<POStatus | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    return purchaseOrders.filter(po => {
      if (filterSupplier !== ALL && po.supplierId !== filterSupplier) return false;
      if (filterProduct !== ALL && po.productId !== filterProduct) return false;
      if (filterStatus !== ALL && po.status !== filterStatus) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const sup = suppliers.find(s => s.id === po.supplierId)?.name ?? '';
        const prod = products.find(p => p.id === po.productId)?.name ?? '';
        if (
          !po.id.toLowerCase().includes(q) &&
          !sup.toLowerCase().includes(q) &&
          !prod.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [search, filterSupplier, filterProduct, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto">
      <Header
        title="Purchase Orders"
        subtitle={`${filtered.length} of ${purchaseOrders.length} orders shown`}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, supplier, or product…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={filterSupplier}
              onChange={e => setFilterSupplier(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={ALL}>All Suppliers</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={ALL}>All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as POStatus | typeof ALL)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={ALL}>All Statuses</option>
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No purchase orders match your filters.</p>
          <button
            className="mt-3 text-sm text-blue-600 hover:underline"
            onClick={() => { setSearch(''); setFilterSupplier(ALL); setFilterProduct(ALL); setFilterStatus(ALL); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">PO ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordered</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Received</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Late?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(po => {
                  const sup = suppliers.find(s => s.id === po.supplierId);
                  const prod = products.find(p => p.id === po.productId);
                  const late = (po.status === 'completed' || po.status === 'partial') && isLate(po);
                  const received = po.receivedQuantity ?? po.orderedQuantity;
                  const short = received < po.orderedQuantity;
                  return (
                    <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{po.id}</td>
                      <td className="px-4 py-2.5 text-gray-800">{sup?.name ?? po.supplierId}</td>
                      <td className="px-4 py-2.5 text-gray-700">{prod?.name ?? po.productId}</td>
                      <td className="px-4 py-2.5 text-gray-600">{formatDateDisplay(parseDate(po.orderDate))}</td>
                      <td className="px-4 py-2.5 text-gray-600">{formatDateDisplay(parseDate(po.expectedDeliveryDate))}</td>
                      <td className="px-4 py-2.5 text-gray-600">
                        {po.actualDeliveryDate
                          ? formatDateDisplay(parseDate(po.actualDeliveryDate))
                          : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{po.orderedQuantity.toLocaleString()}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${short ? 'text-orange-600' : 'text-gray-700'}`}>
                        {(po.receivedQuantity !== undefined ? po.receivedQuantity : po.orderedQuantity).toLocaleString()}
                      </td>
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
      )}
    </div>
  );
}
