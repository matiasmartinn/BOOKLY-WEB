import { z } from 'zod';

// ─── Schedule ─────────────────────────────────────────────────────────────────
// capacity sin .default() para que el tipo input === output y no haya conflicto
// con el Resolver de react-hook-form.

export const scheduleSchema = z.object({
  day: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm requerido'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm requerido'),
  capacity: z.number().int().min(1),
});

export type ScheduleValue = z.infer<typeof scheduleSchema>;

// ─── Full schema ──────────────────────────────────────────────────────────────
// schedules es un array vacío por defecto. No usamos .default() de Zod porque
// genera una discrepancia input/output que rompe el tipo del Resolver.
// El array vacío se maneja desde los defaultValues del useForm.

export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),

  description: z.string().max(500, 'La descripción no puede superar 500 caracteres').optional(),

  phoneNumber: z.string().max(50, 'El telefono no puede superar 50 caracteres').optional(),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
    .optional()
    .or(z.literal('')),

  serviceTypeId: z
    .number('Seleccioná un tipo de servicio')
    .int()
    .min(1, 'Seleccioná un tipo de servicio'),

  durationMinutes: z
    .number('Ingresá una duración')
    .int()
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 480 minutos')
    .optional(),

  price: z.number('Ingresá un precio válido').min(0, 'El precio no puede ser negativo').optional(),

  // schedules es optional en el schema global (RHF lo requiere para defaultValues: [])
  // pero lo valido con min(1) a nivel de paso antes de avanzar.
  schedules: z.array(scheduleSchema).optional(),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

// ─── Per-step schemas ─────────────────────────────────────────────────────────

export const stepSchemas = {
  basic: z.object({
    name: createBusinessSchema.shape.name,
    serviceTypeId: createBusinessSchema.shape.serviceTypeId,
    phoneNumber: createBusinessSchema.shape.phoneNumber,
  }),
  schedules: z.object({
    durationMinutes: createBusinessSchema.shape.durationMinutes,
    schedules: z.array(scheduleSchema).min(1, 'Configurá al menos un horario de atención'),
  }),
} as const;

export type BasicStepValues = z.infer<typeof stepSchemas.basic>;
export type SchedulesStepValues = z.infer<typeof stepSchemas.schedules>;
