import { apiClient } from '@/lib/api-client';
import type { Event, Participant, Checkin } from '@/types/api';
import {
  eventSchema,
  eventsListSchema,
  participantsListSchema,
  checkinsListSchema,
} from './schemas';
import type { EventsQueryParams } from './types';

export async function getEvents(params: EventsQueryParams = {}): Promise<Event[]> {
  const searchParams: Record<string, string | undefined> = {};
  if (params.status) searchParams.status = params.status;
  if (params.q) searchParams.name_like = params.q;
  if (params.sort) {
    searchParams._sort = 'date';
    searchParams._order = params.sort;
  }

  const data = await apiClient.get<unknown>('/events', { searchParams });
  return eventsListSchema.parse(data);
}

export async function getEvent(id: string): Promise<Event> {
  const data = await apiClient.get<unknown>(`/events/${id}`);
  return eventSchema.parse(data);
}

export async function getEventParticipants(eventId: string): Promise<Participant[]> {
  const data = await apiClient.get<unknown>('/participants', {
    searchParams: { event_id: eventId },
  });
  return participantsListSchema.parse(data);
}

export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
  const data = await apiClient.get<unknown>('/checkins', {
    searchParams: { event_id: eventId, _sort: 'timestamp', _order: 'desc' },
  });
  return checkinsListSchema.parse(data);
}
