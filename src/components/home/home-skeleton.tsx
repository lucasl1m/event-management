import { Skeleton } from '@/components/ui/skeleton';

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-6 rounded-md" />
      </div>
      <Skeleton className="h-7 w-16" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="size-7 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${60 + ((i * 37) % 100)}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function EventQuickCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-14 rounded-full" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-2.5 w-8" />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4"
          >
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Active events list */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventQuickCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
