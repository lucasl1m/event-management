export type {
  Event,
  EventStatus,
  Participant,
  ParticipantType,
  ParticipantStatus,
  Checkin,
  CheckinAction,
  CheckinErrorReason,
} from '@/types/api';

export type EventsQueryParams = {
  q?: string;
  status?: 'active' | 'closed' | 'cancelled';
  sort?: 'asc' | 'desc';
};
