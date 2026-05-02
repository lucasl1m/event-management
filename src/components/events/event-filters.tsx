'use client';

import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type StatusFilter = 'all' | 'active' | 'closed' | 'cancelled';
export type SortDirection = 'asc' | 'desc';

type EventFiltersProps = {
  search: string;
  status: StatusFilter;
  sort: SortDirection;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortDirection) => void;
};

export function EventFilters({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: EventFiltersProps) {
  const t = useTranslations('events.filters');
  const toggleSort = () => onSortChange(sort === 'asc' ? 'desc' : 'asc');

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
      <div className="relative flex-1 md:max-w-xl">
        <label htmlFor="events-search" className="sr-only">
          {t('searchLabel')}
        </label>
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="events-search"
          type="search"
          inputMode="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="h-11 rounded-lg border-border/70 bg-card/60 pl-10 text-sm placeholder:text-muted-foreground/70 focus-visible:border-primary/40"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="events-status" className="sr-only">
            {t('statusLabel')}
          </label>
          <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
            <SelectTrigger
              id="events-status"
              className="h-11 min-w-[148px] rounded-lg border-border/70 bg-card/60 text-sm"
            >
              <SelectValue placeholder={t('statusLabel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('statusAll')}</SelectItem>
              <SelectItem value="active">{t('statusActive')}</SelectItem>
              <SelectItem value="closed">{t('statusClosed')}</SelectItem>
              <SelectItem value="cancelled">{t('statusCancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={toggleSort}
          aria-label={
            sort === 'asc'
              ? 'Ordenar por data — atual: mais antigos primeiro. Clique para inverter.'
              : 'Ordenar por data — atual: mais recentes primeiro. Clique para inverter.'
          }
          className="h-11 gap-2 rounded-lg border-border/70 bg-card/60 px-3 text-sm"
        >
          <span>{t('sortDate')}</span>
          {sort === 'asc' ? (
            <ArrowUpIcon className="size-4" aria-hidden />
          ) : (
            <ArrowDownIcon className="size-4" aria-hidden />
          )}
        </Button>
      </div>
    </div>
  );
}
