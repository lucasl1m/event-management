import { apiClient } from '@/lib/api-client';
import { checkinSchema } from '@/features/events/schemas';
import type { Checkin, CheckinAction, CheckinErrorReason, Event, Participant } from '@/types/api';

export type CreateCheckinInput = {
  event_id: string;
  participant_id: string;
  action: CheckinAction;
  success: boolean;
  error_reason: CheckinErrorReason | null;
};

export async function createCheckin(input: CreateCheckinInput): Promise<Checkin> {
  const payload = { ...input, timestamp: new Date().toISOString() };
  const data = await apiClient.post<unknown>('/checkins', payload);
  return checkinSchema.parse(data);
}

export type UpdateParticipantInput = Partial<Pick<Participant, 'status' | 'checkin_count'>>;

export async function updateParticipant(
  id: string,
  patch: UpdateParticipantInput,
): Promise<Participant> {
  return apiClient.patch<Participant>(`/participants/${id}`, patch);
}

export type UpdateEventMetricsInput = Partial<
  Pick<Event, 'checkin_count' | 'error_count' | 'entry_rate'>
>;

export async function updateEventMetrics(
  id: string,
  patch: UpdateEventMetricsInput,
): Promise<Event> {
  return apiClient.patch<Event>(`/events/${id}`, patch);
}
