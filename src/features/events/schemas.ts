import { z } from 'zod';

export const eventStatusSchema = z.enum(['active', 'closed', 'cancelled']);

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  location: z.string(),
  status: eventStatusSchema,
  description: z.string(),
  expected_count: z.number().int().nonnegative(),
  checkin_count: z.number().int().nonnegative(),
  error_count: z.number().int().nonnegative(),
  entry_rate: z.number().min(0).max(1),
});

export const eventsListSchema = z.array(eventSchema);

export const participantTypeSchema = z.enum(['vip', 'normal']);
export const participantStatusSchema = z.enum(['inside', 'outside']);

export const participantSchema = z.object({
  id: z.string(),
  event_id: z.string(),
  name: z.string(),
  type: participantTypeSchema,
  status: participantStatusSchema,
  checkin_count: z.number().int().nonnegative(),
});

export const participantsListSchema = z.array(participantSchema);

export const checkinActionSchema = z.enum(['entry', 'exit']);

export const checkinErrorReasonSchema = z.enum([
  'event_closed',
  'already_checked_in',
  'invalid_action',
]);

export const checkinSchema = z.object({
  id: z.string(),
  event_id: z.string(),
  participant_id: z.string(),
  timestamp: z.string(),
  action: checkinActionSchema,
  success: z.boolean(),
  error_reason: checkinErrorReasonSchema.nullable(),
});

export const checkinsListSchema = z.array(checkinSchema);
