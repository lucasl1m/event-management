import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { EventDetailClient } from '@/components/events/details/event-detail-client';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'eventDetail' });

  return {
    title: t('metadataTitle', { id }),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <EventDetailClient eventId={id} />
    </div>
  );
}
