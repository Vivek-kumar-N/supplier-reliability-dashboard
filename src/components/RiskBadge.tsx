import type { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  showDot?: boolean;
}

const CONFIG: Record<RiskLevel, { classes: string; dot: string }> = {
  Low:      { classes: 'bg-green-100 text-green-800',   dot: 'bg-green-500' },
  Medium:   { classes: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  High:     { classes: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  Critical: { classes: 'bg-red-100 text-red-800',       dot: 'bg-red-500' },
};

export default function RiskBadge({ level, showDot = true }: RiskBadgeProps) {
  const { classes, dot } = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {level}
    </span>
  );
}
