export type EventStatus = 'active' | 'closed' | 'cancelled';

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  description: string;
  expected_count: number;
  checkin_count: number;
  error_count: number;
  entry_rate: number;
};

export type ParticipantType = 'vip' | 'normal';
export type ParticipantStatus = 'inside' | 'outside';

export type Participant = {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
};

export type CheckinAction = 'entry' | 'exit';

export type CheckinErrorReason = 'event_closed' | 'already_checked_in' | 'invalid_action';

export type Checkin = {
  id: string;
  event_id: string;
  participant_id: string;
  timestamp: string;
  action: CheckinAction;
  success: boolean;
  error_reason: CheckinErrorReason | null;
};
