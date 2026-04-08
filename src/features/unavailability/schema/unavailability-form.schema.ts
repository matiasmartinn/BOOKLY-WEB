import { compareDateOnly } from 'shared/utils';
import { z } from 'zod';

export const unavailabilityFormSchema = z
  .object({
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    isFullDay: z.boolean(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    reason: z.string(),
  })
  .superRefine((values, ctx) => {
    if (!values.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Selecciona la fecha inicial.',
      });
    }

    if (!values.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Selecciona la fecha final.',
      });
    }

    if (
      values.startDate &&
      values.endDate &&
      compareDateOnly(values.endDate, values.startDate) < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'La fecha final no puede ser anterior a la inicial.',
      });
    }

    if (!values.isFullDay) {
      if (!values.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startTime'],
          message: 'Selecciona una hora de inicio.',
        });
      }

      if (!values.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endTime'],
          message: 'Selecciona una hora de fin.',
        });
      }

      if (values.startTime && values.endTime && values.endTime <= values.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endTime'],
          message: 'La hora de fin debe ser posterior a la de inicio.',
        });
      }
    }
  });

export type UnavailabilityFormValues = z.infer<typeof unavailabilityFormSchema>;
