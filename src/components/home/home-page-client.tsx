'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  CalendarIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ActivityIcon,
} from 'lucide-react';
import { useEvents } from '@/features/events/hooks';
import { Link } from '@/i18n/navigation';
import { ErrorState } from '@/components/shared/error-state';
import { HomeSkeleton } from './home-skeleton';
import { StatCard } from './stat-card';
import { EventQuickCard } from './event-quick-card';
import { CheckinsChart } from './checkins-chart';
import { EntryRateChart } from './entry-rate-chart';
import { StatusBreakdown } from './status-breakdown';

export function HomePageClient() {
  const t = useTranslations('home');
  const { data: events, isLoading, isError, refetch } = useEvents();

  const metrics = useMemo(() => {
    if (!events?.length) return null;

    const active = events.filter((e) => e.status === 'active').length;
    const closed = events.filter((e) => e.status === 'closed').length;
    const cancelled = events.filter((e) => e.status === 'cancelled').length;
    const totalCheckins = events.reduce((sum, e) => sum + e.checkin_count, 0);
    const totalErrors = events.reduce((sum, e) => sum + e.error_count, 0);
    const validRates = events.filter((e) => e.status !== 'cancelled' && e.expected_count > 0);
    const avgRate =
      validRates.length > 0
        ? validRates.reduce((sum, e) => sum + e.entry_rate, 0) / validRates.length
        : 0;

    return { active, closed, cancelled, totalCheckins, totalErrors, avgRate, total: events.length };
  }, [events]);

  const checkinChartData = useMemo(() => {
    if (!events?.length) return [];
    return events.map((e) => ({
      name: e.name.length > 16 ? e.name.slice(0, 14) + '…' : e.name,
      checkins: e.checkin_count,
      expected: e.expected_count,
    }));
  }, [events]);

  const rateChartData = useMemo(() => {
    if (!events?.length) return [];
    return events
      .filter((e) => e.status !== 'cancelled')
      .map((e) => ({
        name: e.name.length > 16 ? e.name.slice(0, 14) + '…' : e.name,
        rate: Math.round(e.entry_rate * 100),
        status: e.status,
      }));
  }, [events]);

  const activeEvents = useMemo(() => events?.filter((e) => e.status === 'active') ?? [], [events]);

  if (isLoading) return <HomeSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (!events?.length || !metrics) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      {/* Header */}
      <div
        className="flex flex-col gap-1 opacity-0 [animation:fadeInUp_0.35s_ease_forwards]"
        style={{ animationDelay: '0ms' }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('overview', {
            total: metrics.total,
            eventsLabel: metrics.total === 1 ? t('eventsSingular') : t('eventsPlural'),
            active: metrics.active,
            activeLabel: metrics.active === 1 ? t('activeSingular') : t('activePlural'),
            closed: metrics.closed,
            closedLabel: metrics.closed === 1 ? t('closedSingular') : t('closedPlural'),
            cancelled: metrics.cancelled,
            cancelledLabel: metrics.cancelled === 1 ? t('cancelledSingular') : t('cancelledPlural'),
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label={t('stats.totalEvents')}
          value={metrics.total}
          icon={<CalendarIcon className="size-3.5" aria-hidden />}
          accent="muted"
          index={0}
        />
        <StatCard
          label={t('stats.activeEvents')}
          value={metrics.active}
          icon={<ActivityIcon className="size-3.5" aria-hidden />}
          accent="success"
          index={1}
        />
        <StatCard
          label={t('stats.totalCheckins')}
          value={metrics.totalCheckins}
          icon={<CheckCircle2Icon className="size-3.5" aria-hidden />}
          accent="success"
          index={2}
        />
        <StatCard
          label={t('stats.averageRate')}
          value={metrics.avgRate}
          format={{ style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          icon={<TrendingUpIcon className="size-3.5" aria-hidden />}
          accent={metrics.avgRate >= 0.8 ? 'success' : metrics.avgRate >= 0.5 ? 'warning' : 'error'}
          index={3}
        />
        <StatCard
          label={t('stats.totalErrors')}
          value={metrics.totalErrors}
          icon={<AlertCircleIcon className="size-3.5" aria-hidden />}
          accent={metrics.totalErrors > 0 ? 'error' : 'muted'}
          index={4}
        />
      </div>

      {/* Charts */}
      <div
        className="grid grid-cols-1 gap-6 opacity-0 [animation:fadeInUp_0.4s_ease_forwards] lg:grid-cols-2"
        style={{ animationDelay: '380ms' }}
      >
        <CheckinsChart data={checkinChartData} />
        <EntryRateChart data={rateChartData} />
      </div>

      {/* Status breakdown */}
      <div
        className="opacity-0 [animation:fadeInUp_0.4s_ease_forwards]"
        style={{ animationDelay: '500ms' }}
      >
        <StatusBreakdown
          active={metrics.active}
          closed={metrics.closed}
          cancelled={metrics.cancelled}
        />
      </div>

      {/* Active events quick list */}
      {activeEvents.length > 0 && (
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center justify-between opacity-0 [animation:fadeInUp_0.35s_ease_forwards]"
            style={{ animationDelay: '560ms' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t('activeEvents')}
            </p>
            <Link
              href="/events"
              className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80"
            >
              {t('viewAll')} <ArrowRightIcon className="size-3" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeEvents.map((event, i) => (
              <EventQuickCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
