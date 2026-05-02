'use client';

import { useMemo, useState } from 'react';
import { AnimatedNumber } from '@/components/shared/animated-number';
import { StarIcon, SearchIcon, LogInIcon, LogOutIcon, LoaderIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Event, Participant } from '@/types/api';
import { useCheckIn } from '@/features/checkins/hooks';

type ParticipantFilter = 'all' | 'inside' | 'outside';

type ParticipantsTableProps = {
  participants: Participant[];
  event: Event;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function ParticipantTypeBadge({ type }: { type: Participant['type'] }) {
  const t = useTranslations('common.participantType');

  if (type === 'vip') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-foreground">
        <StarIcon className="size-3" aria-hidden />
        {t('vip')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
      {t('normal')}
    </span>
  );
}

function StatusDot({ status }: { status: Participant['status'] }) {
  const t = useTranslations('eventDetail.participants');

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          'size-2 rounded-full',
          status === 'inside'
            ? 'bg-success shadow-[0_0_6px_color-mix(in_oklch,var(--success)_60%,transparent)]'
            : 'bg-muted-foreground',
        )}
      />
      <span
        className={cn('text-sm', status === 'inside' ? 'text-foreground' : 'text-muted-foreground')}
      >
        {status === 'inside' ? t('statusInside') : t('statusOutside')}
      </span>
    </div>
  );
}

function CheckinButton({ participant, event }: { participant: Participant; event: Event }) {
  const t = useTranslations('eventDetail.participants');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const mutation = useCheckIn();
  const isPending = mutation.isPending;
  const isEventClosed = event.status === 'closed' || event.status === 'cancelled';

  const isNormalBlocked = participant.type === 'normal' && participant.checkin_count >= 1;

  const action = participant.status === 'inside' && participant.type === 'vip' ? 'exit' : 'entry';
  const isDisabled = isEventClosed || (action === 'entry' && isNormalBlocked) || isPending;

  let disabledReason = '';
  if (isEventClosed) {
    disabledReason = event.status === 'cancelled' ? t('eventCancelled') : t('eventClosed');
  } else if (isNormalBlocked) {
    disabledReason = t('alreadyCheckedIn');
  }

  const actionLabel = action === 'entry' ? t('entry') : t('exit');

  const button = (
    <Button
      size="sm"
      variant={action === 'exit' ? 'outline' : 'default'}
      disabled={isDisabled}
      aria-label={t('actionFor', { action: actionLabel, name: participant.name })}
      className={cn(
        'h-8 gap-1.5 px-3 text-xs font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed',
        isDisabled && 'bg-muted text-muted-foreground hover:bg-muted',
        action === 'entry' &&
          !isDisabled &&
          'bg-primary text-white hover:bg-primary/90 dark:text-primary-foreground',
      )}
      onClick={() => mutation.mutate({ participant, event, action })}
    >
      {isPending ? (
        <LoaderIcon className="size-3.5 animate-spin" aria-hidden />
      ) : action === 'entry' ? (
        <LogInIcon className="size-3.5" aria-hidden />
      ) : (
        <LogOutIcon className="size-3.5" aria-hidden />
      )}
      {actionLabel}
    </Button>
  );

  if (disabledReason) {
    return (
      <span
        className="relative inline-flex"
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        {button}
        {tooltipOpen ? (
          <span
            role="tooltip"
            className="absolute right-full top-1/2 z-50 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md"
          >
            {disabledReason}
          </span>
        ) : null}
      </span>
    );
  }

  return button;
}

const FILTERS: { value: ParticipantFilter; labelKey: 'all' | 'inside' | 'outside' }[] = [
  { value: 'all', labelKey: 'all' },
  { value: 'inside', labelKey: 'inside' },
  { value: 'outside', labelKey: 'outside' },
];

export function ParticipantsTable({ participants, event }: ParticipantsTableProps) {
  const t = useTranslations('eventDetail.participants');
  const [filter, setFilter] = useState<ParticipantFilter>('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(
    () => ({
      all: participants.length,
      inside: participants.filter((p) => p.status === 'inside').length,
      outside: participants.filter((p) => p.status === 'outside').length,
    }),
    [participants],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return participants
      .filter((p) => (filter === 'all' ? true : p.status === filter))
      .filter((p) => (term ? p.name.toLowerCase().includes(term) : true));
  }, [participants, filter, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="flex items-center gap-0 rounded-lg border border-border/50 bg-card p-0.5"
        >
          {FILTERS.map(({ value, labelKey }) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filter === value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`filters.${labelKey}`)}
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] tabular-nums',
                  filter === value
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted/60 text-muted-foreground',
                )}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <label htmlFor="participant-search" className="sr-only">
            {t('searchLabel')}
          </label>
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="participant-search"
            type="search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full" aria-label={t('tableLabel')}>
          <caption className="sr-only">
            {t('caption', { shown: filtered.length, total: participants.length })}
          </caption>
          <thead>
            <tr className="border-b border-border/50 bg-card">
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t('participant')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t('type')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t('status')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {t('empty')}
                </td>
              </tr>
            ) : (
              filtered.map((participant) => (
                <tr
                  key={participant.id}
                  className="border-b border-border/30 bg-card transition-colors last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {participant.name}
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          <AnimatedNumber value={participant.checkin_count} />{' '}
                          {participant.checkin_count === 1 ? 'check-in' : 'check-ins'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ParticipantTypeBadge type={participant.type} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusDot status={participant.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CheckinButton participant={participant} event={event} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {t('showing', { shown: filtered.length, total: participants.length })}
        </p>
      )}
    </div>
  );
}
