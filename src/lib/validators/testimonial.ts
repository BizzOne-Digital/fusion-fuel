import { z } from 'zod';

export const reviewSubmitSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  role: z.string().trim().max(120).optional(),
  quote: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must be at most 2000 characters'),
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to share your review' }),
  }),
  website: z.string().max(0).optional(),
});

export type ReviewSubmitInput = z.infer<typeof reviewSubmitSchema>;
