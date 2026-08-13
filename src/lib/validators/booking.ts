import { z } from 'zod';
import { EMAIL_REGEX } from '@/lib/constants';

export const bookingStepEventSchema = z.object({
  serviceSlug: z.string().trim().min(1, 'Please select a catering service'),
  eventType: z.string().trim().min(2).max(120),
});

export const bookingStepScheduleSchema = z.object({
  preferredDate: z.coerce.date({ invalid_type_error: 'Preferred date is required' }),
  alternateDate: z.coerce.date().optional(),
  startTime: z.string().trim().min(1, 'Start time is required').max(10),
  guestCount: z.coerce.number().int().min(1).max(10000),
});

export const bookingStepVenueSchema = z.object({
  fulfillmentMethod: z.enum(['delivery', 'pickup']),
  venueName: z.string().trim().max(200).optional(),
  street: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(50),
  zip: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(2).default('US'),
});

export const bookingStepContactSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(200).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(EMAIL_REGEX, 'Invalid email address'),
  phone: z.string().trim().min(7).max(30),
  preferredContactMethod: z.enum(['email', 'phone']).default('email'),
});

export const bookingStepDetailsSchema = z.object({
  productInterests: z.array(z.string().trim()).min(1, 'Select at least one interest'),
  dietaryNotes: z.string().trim().max(2000).optional(),
  budgetRange: z.string().trim().max(120).optional(),
  specialInstructions: z.string().trim().max(3000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted' }),
  }),
  website: z.string().max(0).optional(),
});

export const bookingSchema = bookingStepEventSchema
  .merge(bookingStepScheduleSchema)
  .merge(bookingStepVenueSchema)
  .merge(bookingStepContactSchema)
  .merge(bookingStepDetailsSchema);

export type BookingInput = z.infer<typeof bookingSchema>;
