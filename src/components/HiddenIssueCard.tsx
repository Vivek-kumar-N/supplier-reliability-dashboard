import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { HiddenIssue } from '../types';

interface HiddenIssueCardProps {
  issue: HiddenIssue;
  supplierName: string;
  productName: string;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  quantity: 'Quantity',
  quality:  'Quality',
  combined: 'Combined',
};

export default function HiddenIssueCard({ issue, supplierName, productName }: HiddenIssueCardProps) {
  const isCritical = issue.severity === 'critical';

  return (
    <div
      className={`rounded-xl border-l-4 p-4 ${
        isCritical
          ? 'border-red-500 bg-red-50'
          : 'border-yellow-500 bg-yellow-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${isCritical ? 'text-red-500' : 'text-yellow-600'}`}>
          {isCritical ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isCritical ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
              }`}
            >
              {isCritical ? 'Critical' : 'Warning'} · {ISSUE_TYPE_LABELS[issue.issueType] ?? issue.issueType}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            Hidden issue detected: <span className="text-blue-700">{productName}</span> from{' '}
            <span className="text-blue-700">{supplierName}</span>
          </p>
          <p className="mt-0.5 text-sm text-gray-600">{issue.description}</p>
          <ul className="mt-2 space-y-1">
            {issue.evidence.map((e, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
