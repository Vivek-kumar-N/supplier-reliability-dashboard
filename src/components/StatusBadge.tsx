import type { POStatus } from '../types';

interface StatusBadgeProps {
  status: POStatus;
}

const CONFIG: Record<POStatus, { label: string; classes: string }> = {
  completed: { label: 'Completed',  classes: 'bg-green-100 text-green-800' },
  partial:   { label: 'Partial',    classes: 'bg-yellow-100 text-yellow-800' },
  pending:   { label: 'Pending',    classes: 'bg-blue-100 text-blue-800' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
