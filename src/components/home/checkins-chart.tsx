'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2Icon } from 'lucide-react';

type CheckinsChartDataPoint = {
  name: string;
  'Check-ins': number;
  Esperados: number;
};

type TooltipPayload = { value?: number; name?: string };
type TooltipProps = { active?: boolean; payload?: TooltipPayload[]; label?: string };

// Cores explícitas por nome de série — evita usar entry.color que pode ser
// quase transparente (como a barra "Esperados") e gerar texto ilegível no tooltip.
const SERIES_TEXT_COLORS: Record<string, string> = {
  'Check-ins': 'oklch(0.78 0.16 162.48)',
  Esperados: 'oklch(0.72 0.01 160)',
};

function ChartTooltip({ active, payload, label }: TooltipProps) {
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
          style={{ color: SERIES_TEXT_COLORS[entry.name ?? ''] ?? 'oklch(0.72 0.01 160)' }}
        >
          <span className="font-semibold">{entry.value?.toLocaleString('pt-BR')}</span>{' '}
          <span className="font-normal text-muted-foreground">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

type CheckinsChartProps = {
  data: CheckinsChartDataPoint[];
};

export function CheckinsChart({ data }: CheckinsChartProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Check-ins vs Esperados
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">por evento</p>
        </div>
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2Icon className="size-3.5" aria-hidden />
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'oklch(0.52 0.015 160)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'oklch(0.52 0.015 160)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'oklch(1 0 0 / 3%)' }} />
          <Bar
            dataKey="Esperados"
            fill="oklch(1 0 0 / 14%)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="Check-ins"
            fill="oklch(0.78 0.16 162.48)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
