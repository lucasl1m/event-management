import { ActivityIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/shared/animated-number';

type StatusBreakdownProps = {
  active: number;
  closed: number;
  cancelled: number;
};

const ITEMS = [
  {
    key: 'active' as const,
    icon: ActivityIcon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/20',
  },
  {
    key: 'closed' as const,
    icon: XCircleIcon,
    color: 'text-muted-foreground',
    bg: 'bg-muted/30',
    border: 'border-border/40',
  },
  {
    key: 'cancelled' as const,
    icon: AlertCircleIcon,
    color: 'text-rose-400',
    bg: 'bg-rose-500/8',
    border: 'border-rose-500/20',
  },
];

export function StatusBreakdown({ active, closed, cancelled }: StatusBreakdownProps) {
  const t = useTranslations('home.statusBreakdown');
  const values = { active, closed, cancelled };

  return (
    <div className="grid grid-cols-3 gap-4">
      {ITEMS.map(({ key, icon: Icon, color, bg, border }) => (
        <div key={key} className={cn('flex items-center gap-3 rounded-xl border p-4', bg, border)}>
          <span className={cn('shrink-0', color)}>
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <AnimatedNumber
              value={values[key]}
              className="text-xl font-semibold tabular-nums tracking-tight text-foreground"
            />
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {t(key)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
