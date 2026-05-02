import { cn } from '@/lib/utils';
import type { EventStatus } from '@/types/api';

const STATUS_STYLES: Record<EventStatus, { label: string; container: string; dot: string }> = {
  active: {
    label: 'Ativo',
    container: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]',
  },
  closed: {
    label: 'Encerrado',
    container: 'border-zinc-700/60 bg-zinc-800/50 text-zinc-300',
    dot: 'bg-zinc-400',
  },
  cancelled: {
    label: 'Cancelado',
    container: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400 shadow-[0_0_0_3px_rgba(244,63,94,0.18)]',
  },
};

type StatusBadgeProps = {
  status: EventStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide',
        style.container,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', style.dot)} />
      {style.label}
    </span>
  );
}
