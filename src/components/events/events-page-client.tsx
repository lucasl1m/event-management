'use client';

import { useMemo } from 'react';
import { parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { CalendarSearchIcon, InboxIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEvents } from '@/features/events/hooks';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { EventFilters, type SortDirection, type StatusFilter } from './event-filters';
import { EventList } from './event-list';
import { EventListSkeleton } from './event-list-skeleton';

const statusValues = ['all', 'active', 'closed', 'cancelled'] as const;
const sortValues = ['asc', 'desc'] as const;

export function EventsPageClient() {
  const t = useTranslations('events');
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  );
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum([...statusValues])
      .withDefault('all')
      .withOptions({ clearOnDefault: true }),
  );
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringEnum([...sortValues])
      .withDefault('desc')
      .withOptions({ clearOnDefault: true }),
  );

  const debouncedSearch = useDebouncedValue(search, 350);
  const eventsQuery = useEvents();

  const filteredEvents = useMemo(() => {
    if (!eventsQuery.data) return [];
    const term = debouncedSearch.trim().toLowerCase();

    return eventsQuery.data
      .filter((event) => (status === 'all' ? true : event.status === status))
      .filter((event) => (term ? event.name.toLowerCase().includes(term) : true))
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return sort === 'asc' ? aTime - bTime : bTime - aTime;
      });
  }, [eventsQuery.data, status, debouncedSearch, sort]);

  const totalUnfiltered = eventsQuery.data?.length ?? 0;
  const hasActiveFilters = status !== 'all' || debouncedSearch.trim().length > 0;

  const renderContent = () => {
    if (eventsQuery.isLoading) {
      return <EventListSkeleton count={6} />;
    }

    if (eventsQuery.isError) {
      return (
        <ErrorState
          title={t('loadErrorTitle')}
          description={t('loadErrorDescription')}
          onRetry={() => eventsQuery.refetch()}
        />
      );
    }

    if (totalUnfiltered === 0) {
      return (
        <EmptyState
          icon={InboxIcon}
          title={t('emptyRegistered')}
          description={t('emptyRegisteredDescription')}
        />
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <EmptyState
          icon={CalendarSearchIcon}
          title={t('emptyFiltered')}
          description={t('emptyFilteredDescription')}
          action={
            hasActiveFilters
              ? {
                  label: t('clearFilters'),
                  onClick: () => {
                    setSearch('');
                    setStatus('all');
                  },
                }
              : undefined
          }
        />
      );
    }

    return <EventList events={filteredEvents} />;
  };

  return (
    <section className="flex flex-col gap-6">
      <EventFilters
        search={search}
        status={status as StatusFilter}
        sort={sort as SortDirection}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {!eventsQuery.isLoading && !eventsQuery.isError && totalUnfiltered > 0 ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {t('showing', {
            shown: filteredEvents.length,
            total: totalUnfiltered,
            label: totalUnfiltered === 1 ? t('eventSingle') : t('eventPlural'),
          })}
        </p>
      ) : null}

      {renderContent()}
    </section>
  );
}
