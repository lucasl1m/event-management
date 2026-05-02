'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Checkin } from '@/types/api';

type EntriesOverTimeChartProps = {
  checkins: Checkin[];
};

type ChartDataPoint = {
  hour: string;
  entries: number;
};

type TooltipPayload = { value?: number };
type CustomTooltipProps = { active?: boolean; payload?: TooltipPayload[]; label?: string };

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {payload[0]?.value ?? 0}{' '}
        <span className="font-normal text-muted-foreground">
          {(payload[0]?.value ?? 0) === 1 ? 'entrada' : 'entradas'}
        </span>
      </p>
    </div>
  );
}

export function EntriesOverTimeChart({ checkins }: EntriesOverTimeChartProps) {
  const data = useMemo<ChartDataPoint[]>(() => {
    const entries = checkins.filter((c) => c.action === 'entry' && c.success);
    if (entries.length === 0) return [];

    const counts: Record<string, number> = {};
    for (const checkin of entries) {
      const date = new Date(checkin.timestamp);
      const hour = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      counts[hour] = (counts[hour] ?? 0) + 1;
    }

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({ hour, entries: count }));
  }, [checkins]);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Nenhuma entrada registrada
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fill: 'oklch(0.52 0.015 160)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: 'oklch(0.52 0.015 160)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
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
