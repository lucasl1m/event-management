'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { TrendingUpIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

export type RateChartDataPoint = {
  name: string;
  rate: number;
  status: string;
};

type TooltipPayload = { value?: number };
type TooltipProps = { active?: boolean; payload?: TooltipPayload[]; label?: string };

function RateTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const rate = (payload[0]?.value ?? 0) / 100;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-xl">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums text-foreground">{formatPercent(rate)}</p>
    </div>
  );
}

const LEGEND: { color: string; label?: string; labelKey?: 'closed' }[] = [
  { color: 'bg-emerald-400', label: '≥ 80%' },
  { color: 'bg-amber-400', label: '50–79%' },
  { color: 'bg-rose-400', label: '< 50%' },
  { color: 'bg-muted-foreground/40', labelKey: 'closed' },
];

function barFill(entry: RateChartDataPoint): string {
  if (entry.status === 'closed') return 'var(--muted-foreground)';
  if (entry.rate >= 80) return 'oklch(0.78 0.16 162.48)';
  if (entry.rate >= 50) return 'oklch(0.82 0.13 70)';
  return 'oklch(0.65 0.23 16)';
}

type EntryRateChartProps = {
  data: RateChartDataPoint[];
};

export function EntryRateChart({ data }: EntryRateChartProps) {
  const t = useTranslations('home.charts');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
            {t('entryRate')}
          </p>
          <p className="mt-0.5 text-xs text-foreground">{t('byEventPercent')}</p>
        </div>
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <TrendingUpIcon className="size-3.5" aria-hidden />
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, 120]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<RateTooltip />} cursor={{ fill: 'var(--chart-cursor)' }} />
          <ReferenceLine y={100} stroke="var(--border)" strokeDasharray="4 4" />
          <Bar dataKey="rate" radius={[3, 3, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={barFill(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-4 border-t border-border/40 pt-3">
        {LEGEND.map(({ color, label, labelKey }) => (
          <span key={label ?? labelKey} className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-sm', color)} />
            <span className="text-[10px] text-foreground">{labelKey ? t(labelKey) : label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
