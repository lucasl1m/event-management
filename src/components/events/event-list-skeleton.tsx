import { Skeleton } from '@/components/ui/skeleton';

type EventListSkeletonProps = {
  count?: number;
};

export function EventListSkeleton({ count = 6 }: EventListSkeletonProps) {
  return (
    <ul
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="flex w-full flex-col gap-5 rounded-xl border border-border/60 bg-card/40 p-5"
        >
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-14" />
            </div>
            <Skeleton className="size-5 rounded-md" />
          </div>
        </li>
      ))}
    </ul>
  );
}
