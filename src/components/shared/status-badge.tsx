import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { EventStatus } from '@/types/api';

const STATUS_STYLES: Record<
  EventStatus,
  { labelKey: EventStatus; container: string; dot: string }
> = {
  active: {
    labelKey: 'active',
    container: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]',
  },
  closed: {
    labelKey: 'closed',
    container: 'border-border bg-muted/60 text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  cancelled: {
    labelKey: 'cancelled',
    container: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400 shadow-[0_0_0_3px_rgba(244,63,94,0.18)]',
  },
};

type StatusBadgeProps = {
  status: EventStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('common.status');
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide w-fit',
        style.container,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', style.dot)} />
      {t(style.labelKey)}
    </span>
  );
}
