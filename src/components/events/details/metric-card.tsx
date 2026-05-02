import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MetricVariant = 'default' | 'success' | 'warning' | 'error';

type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  subtitle?: ReactNode;
  variant?: MetricVariant;
  extra?: ReactNode;
  index?: number;
};

const variantIconStyles: Record<MetricVariant, string> = {
  default: 'bg-muted/50 text-muted-foreground',
  success: 'bg-emerald-500/10 text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-400',
  error: 'bg-rose-500/10 text-rose-400',
};

const variantSubtitleStyles: Record<MetricVariant, string> = {
  default: 'text-muted-foreground',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-rose-400',
};

const variantBorderStyles: Record<MetricVariant, string> = {
  default: '',
  success: '[border-top-color:theme(colors.emerald.500/40%)]',
  warning: '[border-top-color:theme(colors.amber.500/40%)]',
  error: '[border-top-color:theme(colors.rose.500/40%)]',
};

export function MetricCard({
  label,
  value,
  icon,
  subtitle,
  variant = 'default',
  extra,
  index = 0,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5',
        'opacity-0 [animation:fadeInUp_0.4s_ease_forwards]',
        variant !== 'default' && 'border-t-2',
        variantBorderStyles[variant],
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg',
            variantIconStyles[variant],
          )}
        >
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </span>
        {subtitle && (
          <span className={cn('text-xs font-medium', variantSubtitleStyles[variant])}>
            {subtitle}
          </span>
        )}
      </div>

      {extra}
    </div>
  );
}
