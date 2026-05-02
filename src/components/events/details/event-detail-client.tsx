'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, CalendarIcon, MapPinIcon, UsersIcon, BanIcon } from 'lucide-react';
import { useEvent, useEventCheckins, useEventParticipants } from '@/features/events/hooks';
import { useUiStore } from '@/stores/ui-store';
import { Link } from '@/i18n/navigation';
import { formatEventDate } from '@/lib/format';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { MetricsGrid } from './metrics-grid';
import { EntriesOverTimeChart } from './entries-over-time-chart';
import { SuccessErrorChart } from './success-error-chart';
import { ParticipantsTable } from './participants-table';
import { EventDetailSkeleton } from './event-detail-skeleton';

type EventDetailClientProps = {
  eventId: string;
};

export function EventDetailClient({ eventId }: EventDetailClientProps) {
  const t = useTranslations('eventDetail');
  const eventQuery = useEvent(eventId);
  const participantsQuery = useEventParticipants(eventId);
  const checkinsQuery = useEventCheckins(eventId);
  const setLastVisitedEventId = useUiStore((s) => s.setLastVisitedEventId);

  useEffect(() => {
    if (eventQuery.data) setLastVisitedEventId(eventId);
  }, [eventId, eventQuery.data, setLastVisitedEventId]);

  const isLoading = eventQuery.isLoading || participantsQuery.isLoading || checkinsQuery.isLoading;
  const isError = eventQuery.isError;

  if (isLoading) return <EventDetailSkeleton ariaLabel={t('loadingEvent')} />;

  if (isError || !eventQuery.data) {
    return (
      <ErrorState
        title={t('loadErrorTitle')}
        description={t('loadErrorDescription')}
        onRetry={() => {
          eventQuery.refetch();
          participantsQuery.refetch();
          checkinsQuery.refetch();
        }}
      />
    );
  }

  const event = eventQuery.data;
  const participants = participantsQuery.data ?? [];
  const checkins = checkinsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease_forwards] opacity-0">
      {/* Breadcrumb */}
      <nav aria-label={t('breadcrumbLabel')} className="flex items-center gap-1.5 text-sm">
        <Link
          href="/events"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('breadcrumbEvents')}
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/50" aria-hidden />
        <span className="truncate font-medium text-foreground" aria-current="page">
          {event.name}
        </span>
      </nav>

      {/* Event header */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {event.name}
          </h1>
          <StatusBadge status={event.status} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="size-3.5 shrink-0" aria-hidden />
            {formatEventDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
            {event.location}
          </span>
        </div>

        {event.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{event.description}</p>
        )}
      </header>

      {/* Closed/cancelled banner */}
      {(event.status === 'closed' || event.status === 'cancelled') && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3.5"
        >
          <BanIcon className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-amber-300">
              {event.status === 'cancelled'
                ? t('closedBanner.cancelled')
                : t('closedBanner.closed')}
            </p>
            <p className="text-xs text-amber-400/80">{t('closedBanner.description')}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          {t('metricsTitle')}
        </h2>
        <MetricsGrid event={event} />
      </section>

      {/* Charts */}
      <section
        aria-labelledby="charts-heading"
        className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]"
      >
        <h2 id="charts-heading" className="sr-only">
          {t('chartsTitle')}
        </h2>

        <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">{t('entriesEvolution')}</h3>
          <EntriesOverTimeChart checkins={checkins} />
        </div>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-5">
          <h3 className="w-full text-sm font-semibold text-foreground">{t('successVsError')}</h3>
          <SuccessErrorChart event={event} />
        </div>
      </section>

      {/* Participants */}
      <section aria-labelledby="participants-heading">
        <h2 id="participants-heading" className="mb-4 text-lg font-semibold text-foreground">
          {t('participantsTitle')}
        </h2>

        {participants.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={t('emptyParticipants')}
            description={t('emptyParticipantsDescription')}
          />
        ) : (
          <ParticipantsTable participants={participants} event={event} />
        )}
      </section>
    </div>
  );
}
