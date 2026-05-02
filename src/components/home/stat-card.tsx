import NumberFlow, { type Format } from '@number-flow/react';
import { cn } from '@/lib/utils';

export type StatCardAccent = 'emerald' | 'amber' | 'rose' | 'muted';

export type StatCardProps = {
  label: string;
  value: number;
  format?: Format;
  icon: React.ReactNode;
  accent?: StatCardAccent;
  index?: number;
};

const accentStyles: Record<StatCardAccent, { icon: string; border: string }> = {
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    border: '[border-top-color:oklch(0.78_0.16_162.48/40%)] border-t-2',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400',
    border: '[border-top-color:oklch(0.82_0.13_70/40%)] border-t-2',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-400',
    border: '[border-top-color:oklch(0.65_0.23_16/40%)] border-t-2',
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
      <NumberFlow
        value={value}
        format={format}
        locales="pt-BR"
        className="text-3xl font-semibold tabular-nums tracking-tight text-foreground"
      />
    </div>
  );
}
