import { AlertTriangleIcon, TrendingUpIcon, UsersIcon, UserCheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Event } from '@/types/api';
import { formatPercent } from '@/lib/format';
import { AnimatedNumber } from '@/components/shared/animated-number';
import { MetricCard } from './metric-card';

type MetricsGridProps = {
  event: Event;
};

export function MetricsGrid({ event }: MetricsGridProps) {
  const t = useTranslations('eventDetail.metrics');
  const totalAttempts = event.checkin_count + event.error_count;
  const errorRate = totalAttempts > 0 ? event.error_count / totalAttempts : 0;
  const entryPercent = event.expected_count > 0 ? event.entry_rate : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        index={0}
        label={t('expectedParticipants')}
        value={<AnimatedNumber value={event.expected_count} />}
        icon={<UsersIcon className="size-4" aria-hidden />}
        subtitle={t('venueCapacity')}
        variant="default"
      />

      <MetricCard
        index={1}
        label={t('completedCheckins')}
        value={<AnimatedNumber value={event.checkin_count} />}
        icon={<UserCheckIcon className="size-4" aria-hidden />}
        subtitle={t('expectedPercent', { percent: formatPercent(entryPercent) })}
        variant="success"
      />

      <MetricCard
        index={2}
        label={t('failedAttempts')}
        value={<AnimatedNumber value={event.error_count} />}
        icon={<AlertTriangleIcon className="size-4" aria-hidden />}
        subtitle={
          totalAttempts > 0
            ? t('attemptPercent', { percent: formatPercent(errorRate) })
            : t('noAttempts')
        }
        variant={event.error_count > 0 ? 'error' : 'default'}
      />

      <MetricCard
        index={3}
        label={t('entryRate')}
        value={
          <AnimatedNumber
            value={entryPercent}
            format={{ style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          />
        }
        icon={<TrendingUpIcon className="size-4" aria-hidden />}
        variant={entryPercent >= 0.5 ? 'success' : entryPercent > 0 ? 'warning' : 'default'}
        extra={
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50"
            role="progressbar"
            aria-label={t('entryRate')}
            aria-valuenow={Math.round(entryPercent * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-success transition-all duration-700"
              style={{ width: `${Math.min(entryPercent * 100, 100)}%` }}
            />
          </div>
        }
      />
    </div>
  );
}
