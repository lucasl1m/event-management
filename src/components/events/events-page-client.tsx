'use client';

import { useMemo } from 'react';
import { parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { useEvents } from '@/features/events/hooks';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { EventFilters, type SortDirection, type StatusFilter } from './event-filters';
import { EventList } from './event-list';

const statusValues = ['all', 'active', 'closed', 'cancelled'] as const;
const sortValues = ['asc', 'desc'] as const;

export function EventsPageClient() {
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

      {totalUnfiltered > 0 ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Mostrando{' '}
          <span className="font-medium tabular-nums text-foreground">{filteredEvents.length}</span>{' '}
          de <span className="font-medium tabular-nums text-foreground">{totalUnfiltered}</span>{' '}
          {totalUnfiltered === 1 ? 'evento' : 'eventos'}.
        </p>
      ) : null}

      <EventList events={filteredEvents} />
    </section>
  );
}
