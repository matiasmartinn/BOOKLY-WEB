import { z } from 'zod';

export const rescheduleAppointmentFormSchema = z.object({
  date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: 'La fecha es obligatoria.',
    }),

  slot: z.string().trim().min(1, 'Debes seleccionar un horario.'),
});

export type RescheduleAppointmentFormValues = z.infer<typeof rescheduleAppointmentFormSchema>;
