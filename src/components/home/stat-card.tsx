import { type Format } from '@number-flow/react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/shared/animated-number';

export type StatCardAccent = 'success' | 'warning' | 'error' | 'muted';

export type StatCardProps = {
  label: string;
  value: number;
  format?: Format;
  icon: React.ReactNode;
  accent?: StatCardAccent;
  index?: number;
};

const accentStyles: Record<StatCardAccent, { icon: string; border: string }> = {
  success: {
    icon: 'bg-success/10 text-success',
    border: 'border-t-2 border-t-success/40',
  },
  warning: {
    icon: 'bg-warning/10 text-warning',
    border: 'border-t-2 border-t-warning/40',
  },
  error: {
    icon: 'bg-destructive/10 text-destructive',
    border: 'border-t-2 border-t-destructive/40',
  },
  muted: {
    icon: 'bg-muted/50 text-muted-foreground',
    border: '',
  },
};

export function StatCard({
  label,
  value,
  format,
  icon,
  accent = 'muted',
  index = 0,
}: StatCardProps) {
  const styles = accentStyles[accent];
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5',
        'opacity-0 [animation:fadeInUp_0.4s_ease_forwards]',
        styles.border,
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn('flex size-7 shrink-0 items-center justify-center rounded-lg', styles.icon)}
        >
          {icon}
        </span>
      </div>
      <AnimatedNumber
        value={value}
        format={format}
        className="text-3xl font-semibold tabular-nums tracking-tight text-foreground"
      />
    </div>
  );
}
