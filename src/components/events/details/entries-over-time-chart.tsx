'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocale, useTranslations } from 'next-intl';
import type { Checkin } from '@/types/api';

type EntriesOverTimeChartProps = {
  checkins: Checkin[];
};

type ChartDataPoint = {
  hour: string;
  entries: number;
};

type TooltipPayload = { value?: number };
type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  entrySingular: string;
  entryPlural: string;
};

function CustomTooltip({ active, payload, label, entrySingular, entryPlural }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {value}{' '}
        <span className="font-normal text-muted-foreground">
          {value === 1 ? entrySingular : entryPlural}
        </span>
      </p>
    </div>
  );
}

export function EntriesOverTimeChart({ checkins }: EntriesOverTimeChartProps) {
  const t = useTranslations('eventDetail.entriesChart');
  const locale = useLocale();
  const data = useMemo<ChartDataPoint[]>(() => {
    const entries = checkins.filter((c) => c.action === 'entry' && c.success);
    if (entries.length === 0) return [];

    const counts: Record<string, number> = {};
    for (const checkin of entries) {
      const date = new Date(checkin.timestamp);
      const hour = date.toLocaleTimeString(locale === 'pt' ? 'pt-BR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      counts[hour] = (counts[hour] ?? 0) + 1;
    }

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({ hour, entries: count }));
  }, [checkins, locale]);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        {t('empty')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={
            <CustomTooltip entrySingular={t('entrySingular')} entryPlural={t('entryPlural')} />
          }
          cursor={{ fill: 'var(--chart-cursor)' }}
        />
        <Bar
          dataKey="entries"
          fill="oklch(0.78 0.16 162.48)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
