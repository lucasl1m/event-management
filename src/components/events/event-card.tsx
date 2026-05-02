import Link from 'next/link';
import { CalendarIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatEventDate, formatNumber } from '@/lib/format';
import type { Event } from '@/types/api';
import { StatusBadge } from './status-badge';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const isUnavailable = event.status === 'closed' || event.status === 'cancelled';

  return (
    <Link
      href={`/events/${event.id}`}
      aria-label={`Abrir detalhes do evento ${event.name}`}
      className={cn(
        'group relative flex w-full flex-col gap-5 rounded-xl border border-border/70 bg-card/60 p-5',
        'transition-all duration-200',
        'hover:border-emerald-500/30 hover:bg-card focus-visible:border-emerald-500/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={event.status} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
          {event.name}
        </h3>

        <dl className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Data</dt>
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
            <dd>{formatEventDate(event.date)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Local</dt>
            <MapPinIcon className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
            <dd className="line-clamp-1">{event.location}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Esperados
          </p>
          <p
            className={cn(
              'text-2xl font-semibold tabular-nums tracking-tight text-foreground',
              isUnavailable && 'text-muted-foreground line-through decoration-muted-foreground/40',
            )}
          >
            {formatNumber(event.expected_count)}
          </p>
        </div>
        <ChevronRightIcon
          aria-hidden
          className="size-5 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-400"
        />
      </div>
    </Link>
  );
}
