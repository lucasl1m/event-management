'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import type { Event } from '@/types/api';
import { formatNumber, formatPercent } from '@/lib/format';

type SuccessErrorChartProps = {
  event: Event;
};

type TooltipPayload = { name?: string; value?: number; payload?: { fill?: string } };
type CustomTooltipProps = { active?: boolean; payload?: TooltipPayload[] };

const ERROR_SEGMENT_COLOR = 'var(--chart-4)';

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium" style={{ color: item?.payload?.fill }}>
        {item?.name}
      </p>
      <p className="text-sm font-semibold tabular-nums text-foreground">{item?.value}</p>
    </div>
  );
}

export function SuccessErrorChart({ event }: SuccessErrorChartProps) {
  const t = useTranslations('eventDetail.successErrorChart');
  const total = event.checkin_count + event.error_count;
  const successRate = total > 0 ? event.checkin_count / total : 0;
  const errorRate = total > 0 ? event.error_count / total : 0;

  const data = [
    { name: t('success'), value: event.checkin_count, fill: 'var(--primary)' },
    { name: t('error'), value: event.error_count, fill: ERROR_SEGMENT_COLOR },
  ];

  if (total === 0) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              strokeWidth={0}
              paddingAngle={event.error_count > 0 ? 2 : 0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {formatNumber(total)}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('attempts')}
          </span>
        </div>
      </div>

      <div className="flex w-full justify-center gap-6">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" aria-hidden />
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {formatPercent(successRate)}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('success')}
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-4" aria-hidden />
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {formatPercent(errorRate)}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('error')}
          </span>
        </div>
      </div>
    </div>
  );
}
