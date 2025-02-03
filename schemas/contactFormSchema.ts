import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(2, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
