import { AlertTriangleIcon, TrendingUpIcon, UsersIcon, UserCheckIcon } from 'lucide-react';
import type { Event } from '@/types/api';
import { formatNumber, formatPercent } from '@/lib/format';
import { MetricCard } from './metric-card';

type MetricsGridProps = {
  event: Event;
};

export function MetricsGrid({ event }: MetricsGridProps) {
  const totalAttempts = event.checkin_count + event.error_count;
  const errorRate = totalAttempts > 0 ? event.error_count / totalAttempts : 0;
  const entryPercent = event.expected_count > 0 ? event.entry_rate : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        index={0}
        label="Participantes Esperados"
        value={formatNumber(event.expected_count)}
        icon={<UsersIcon className="size-4" aria-hidden />}
        subtitle="Capacidade total do local"
        variant="default"
      />

      <MetricCard
        index={1}
        label="Check-ins Realizados"
        value={formatNumber(event.checkin_count)}
        icon={<UserCheckIcon className="size-4" aria-hidden />}
        subtitle={`${formatPercent(entryPercent)} dos esperados`}
        variant="success"
      />

      <MetricCard
        index={2}
        label="Tentativas com Erro"
        value={formatNumber(event.error_count)}
        icon={<AlertTriangleIcon className="size-4" aria-hidden />}
        subtitle={
          totalAttempts > 0 ? `${formatPercent(errorRate)} das tentativas` : 'Sem tentativas'
        }
        variant={event.error_count > 0 ? 'warning' : 'default'}
      />

      <MetricCard
        index={3}
        label="Taxa de Entrada"
        value={formatPercent(entryPercent)}
        icon={<TrendingUpIcon className="size-4" aria-hidden />}
        variant={entryPercent >= 0.5 ? 'success' : entryPercent > 0 ? 'warning' : 'default'}
        extra={
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50"
            role="progressbar"
            aria-valuenow={Math.round(entryPercent * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(entryPercent * 100, 100)}%` }}
            />
          </div>
        }
      />
    </div>
  );
}
