import type { Event } from '@/types/api';
import { EventCard } from './event-card';

type EventListProps = {
  events: Event[];
};

export function EventList({ events }: EventListProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <li key={event.id} className="flex h-full">
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
