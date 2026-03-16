import { z } from 'zod';

export const businessFormSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  serviceTypeId: z.number(),
  durationMinutes: z.number(),
});

export type BusinessFormRequest = z.infer<typeof businessFormSchema>;
