import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CheckinAction, Event, Participant } from '@/types/api';
import { eventsKeys } from '@/features/events/hooks';
import {
  createCheckin,
  updateEventMetrics,
  updateParticipant,
  type UpdateEventMetricsInput,
  type UpdateParticipantInput,
} from './api';
import { checkinErrorMessages, validateCheckIn } from './rules';

export type CheckInVariables = {
  participant: Participant;
  event: Event;
  action: CheckinAction;
};

function computeEntryRate(checkinCount: number, expected: number): number {
  if (expected <= 0) return 0;
  const rate = checkinCount / expected;
  return Math.min(1, Math.max(0, Number(rate.toFixed(4))));
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participant, event, action }: CheckInVariables) => {
      const validation = validateCheckIn({ participant, event, action });

      if (!validation.ok) {
        await createCheckin({
          event_id: event.id,
          participant_id: participant.id,
          action,
          success: false,
          error_reason: validation.reason,
        });

        const nextEventMetrics: UpdateEventMetricsInput = {
          error_count: event.error_count + 1,
        };
        await updateEventMetrics(event.id, nextEventMetrics);

        throw new Error(checkinErrorMessages[validation.reason]);
      }

      await createCheckin({
        event_id: event.id,
        participant_id: participant.id,
        action,
        success: true,
        error_reason: null,
      });

      const isEntry = action === 'entry';
      const nextParticipant: UpdateParticipantInput = {
        status: isEntry ? 'inside' : 'outside',
        checkin_count: participant.checkin_count + 1,
      };
      await updateParticipant(participant.id, nextParticipant);

      const nextCheckinCount = isEntry ? event.checkin_count + 1 : event.checkin_count;
      const nextEventMetrics: UpdateEventMetricsInput = {
        checkin_count: nextCheckinCount,
        entry_rate: computeEntryRate(nextCheckinCount, event.expected_count),
      };
      await updateEventMetrics(event.id, nextEventMetrics);

      return { action, participant_id: participant.id, event_id: event.id };
    },
    onSuccess: (result) => {
      const message =
        result.action === 'entry'
          ? 'Check-in realizado com sucesso.'
          : 'Saída registrada com sucesso.';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(result.event_id) });
      queryClient.invalidateQueries({ queryKey: eventsKeys.participants(result.event_id) });
      queryClient.invalidateQueries({ queryKey: eventsKeys.checkins(result.event_id) });
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    onError: (error, variables) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar check-in.');
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(variables.event.id) });
    },
  });
}
