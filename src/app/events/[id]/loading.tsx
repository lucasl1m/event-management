import { EventDetailSkeleton } from '@/components/events/details/event-detail-skeleton';

export default function EventDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <EventDetailSkeleton />
    </div>
  );
}
