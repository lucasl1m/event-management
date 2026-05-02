import type { Metadata } from 'next';
import { EventDetailClient } from '@/components/events/details/event-detail-client';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Evento ${id} — Painel de Gestão de Eventos`,
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
