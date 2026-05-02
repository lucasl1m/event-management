import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/format';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Event } from '@/types/api';

type EventQuickCardProps = {
  event: Event;
  index: number;
};

export function EventQuickCard({ event, index }: EventQuickCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card p-4',
        'opacity-0 [animation:fadeInUp_0.4s_ease_forwards]',
        'transition-colors duration-150 hover:border-emerald-500/30 hover:bg-card/80',
      )}
      style={{ animationDelay: `${600 + index * 60}ms` }}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <StatusBadge status={event.status} />
        <p className="truncate text-sm font-semibold text-foreground">{event.name}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon className="size-3 shrink-0" aria-hidden />
          {formatEventDate(event.date)}
        </p>
      </div>

      <ArrowRightIcon
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-emerald-400"
      />
    </Link>
  );
}
