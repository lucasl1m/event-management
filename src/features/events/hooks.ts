import { useQuery } from '@tanstack/react-query';
import { getEvent, getEventCheckins, getEventParticipants, getEvents } from './api';
import type { EventsQueryParams } from './types';

export const eventsKeys = {
  all: ['events'] as const,
  list: (params: EventsQueryParams) => ['events', 'list', params] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
  participants: (id: string) => ['events', id, 'participants'] as const,
  checkins: (id: string) => ['events', id, 'checkins'] as const,
};

export function useEvents(params: EventsQueryParams = {}) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => getEvents(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });
}

export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: eventsKeys.participants(eventId),
    queryFn: () => getEventParticipants(eventId),
    enabled: Boolean(eventId),
  });
}

export function useEventCheckins(eventId: string) {
  return useQuery({
    queryKey: eventsKeys.checkins(eventId),
    queryFn: () => getEventCheckins(eventId),
    enabled: Boolean(eventId),
  });
}
