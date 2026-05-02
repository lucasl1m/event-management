import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { EventsPageClient } from '@/components/events/events-page-client';
import { EventListSkeleton } from '@/components/events/event-list-skeleton';

export const metadata: Metadata = {
  title: 'Events',
  description: 'List, filter and manage all events.',
};

export default async function EventsPage() {
  const t = await getTranslations('events');
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Suspense fallback={<EventListSkeleton count={6} />}>
        <EventsPageClient />
      </Suspense>
    </div>
  );
}
