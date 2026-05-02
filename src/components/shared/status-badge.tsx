import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { EventStatus } from '@/types/api';

const STATUS_STYLES: Record<
  EventStatus,
  { labelKey: EventStatus; container: string; dot: string }
> = {
  active: {
    labelKey: 'active',
    container: 'border-success/30 bg-success/10 text-foreground',
    dot: 'bg-success shadow-[0_0_0_3px_color-mix(in_oklch,var(--success)_18%,transparent)]',
  },
  closed: {
    labelKey: 'closed',
    container: 'border-border bg-muted/60 text-foreground',
    dot: 'bg-muted-foreground',
  },
  cancelled: {
    labelKey: 'cancelled',
    container: 'border-destructive/30 bg-destructive/10 text-foreground',
    dot: 'bg-destructive shadow-[0_0_0_3px_color-mix(in_oklch,var(--destructive)_18%,transparent)]',
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
