'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

type CheckinsChartDataPoint = {
  name: string;
  checkins: number;
  expected: number;
};

type SeriesKey = 'checkins' | 'expected';
type TooltipPayload = { value?: number; dataKey?: SeriesKey };
type TooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  labels: Record<SeriesKey, string>;
  locale: string;
};

const SERIES_TEXT_COLORS: Record<SeriesKey, string> = {
  checkins: 'oklch(0.78 0.16 162.48)',
  expected: 'var(--muted-foreground)',
};

function ChartTooltip({ active, payload, label, labels, locale }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-xl">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm tabular-nums"
          style={{ color: SERIES_TEXT_COLORS[entry.dataKey ?? 'expected'] }}
        >
          <span className="font-semibold">
            {entry.value?.toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US')}
          </span>{' '}
          <span className="font-normal text-muted-foreground">
            {labels[entry.dataKey ?? 'expected']}
          </span>
        </p>
      ))}
    </div>
  );
}

type CheckinsChartProps = {
  data: CheckinsChartDataPoint[];
};

export function CheckinsChart({ data }: CheckinsChartProps) {
  const t = useTranslations('home.charts');
  const locale = useLocale();
  const labels: Record<SeriesKey, string> = {
    checkins: t('checkins'),
    expected: t('expected'),
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
            {t('checkinsVsExpected')}
          </p>
          <p className="mt-0.5 text-xs text-foreground">{t('byEvent')}</p>
        </div>
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2Icon className="size-3.5" aria-hidden />
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={3}>
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
          />
          <Tooltip
            content={<ChartTooltip labels={labels} locale={locale} />}
            cursor={{ fill: 'var(--chart-cursor)' }}
          />
          <Bar
            dataKey="expected"
            fill="color-mix(in oklch, var(--foreground) 14%, transparent)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="checkins"
            fill="oklch(0.78 0.16 162.48)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
