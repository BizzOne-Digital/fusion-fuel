import { z } from 'zod';
import { EMAIL_REGEX } from '@/lib/constants';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(EMAIL_REGEX, 'Invalid email address'),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  preferredContactMethod: z.enum(['email', 'phone']).default('email'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted' }),
  }),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
