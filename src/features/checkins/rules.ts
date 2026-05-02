import type { CheckinAction, CheckinErrorReason, Event, Participant } from '@/types/api';

export type CheckInIntent = {
  participant: Participant;
  event: Event;
  action: CheckinAction;
};

export type CheckInResult = { ok: true } | { ok: false; reason: CheckinErrorReason };

export function validateCheckIn(intent: CheckInIntent): CheckInResult {
  const { event, participant, action } = intent;

  if (event.status === 'closed' || event.status === 'cancelled') {
    return { ok: false, reason: 'event_closed' };
  }

  if (participant.type === 'normal') {
    if (action === 'exit') return { ok: false, reason: 'invalid_action' };
    if (participant.checkin_count >= 1) return { ok: false, reason: 'already_checked_in' };
    return { ok: true };
  }

  if (action === 'entry' && participant.status === 'inside') {
    return { ok: false, reason: 'invalid_action' };
  }
  if (action === 'exit' && participant.status === 'outside') {
    return { ok: false, reason: 'invalid_action' };
  }

  return { ok: true };
}
