import { Suspense } from 'react';
import { EventsPageClient } from '@/components/events/events-page-client';
import { EventListSkeleton } from '@/components/events/event-list-skeleton';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Eventos
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie e acompanhe todos os seus eventos em um só lugar.
        </p>
      </div>

      <Suspense fallback={<EventListSkeleton count={6} />}>
        <EventsPageClient />
      </Suspense>
    </div>
  );
}
