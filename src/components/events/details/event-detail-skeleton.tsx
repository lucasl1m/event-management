import { Skeleton } from '@/components/ui/skeleton';

export function EventDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Carregando evento">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <Skeleton className="mb-4 h-4 w-36" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-44 rounded-full" />
            <div className="flex gap-6">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex justify-between gap-3">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-9 w-64 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border/30 px-4 py-3.5 last:border-0"
            >
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
