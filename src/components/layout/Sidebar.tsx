import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Building2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',                  label: 'Overview',          icon: LayoutDashboard },
  { to: '/purchase-orders',   label: 'Purchase Orders',   icon: ShoppingCart },
  { to: '/suppliers',         label: 'Suppliers',         icon: Building2 },
  { to: '/issue-analysis',    label: 'Issue Analysis',    icon: AlertTriangle },
  { to: '/recommendations',   label: 'Recommendations',   icon: Lightbulb },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Supplier Intel</p>
            <p className="text-xs text-gray-400 leading-tight">Reliability Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">Hackathon Demo · 2026</p>
      </div>
    </aside>
  );
}
