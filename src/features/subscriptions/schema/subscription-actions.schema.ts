import z from 'zod';

const missingOwnerMessage = 'No se pudo resolver la cuenta para gestionar la suscripcion.';
const missingPlanMessage = 'El plan seleccionado no tiene un identificador valido.';

export const renewSubscriptionSchema = z.object({
  ownerId: z.number().int().refine((value) => value > 0, missingOwnerMessage),
});

export const changePlanSchema = z
  .object({
    ownerId: z.number().int().refine((value) => value > 0, missingOwnerMessage),
    targetPlan: z.string().trim().min(1, missingPlanMessage).optional(),
    planName: z.union([z.string().trim().min(1, missingPlanMessage), z.number().int()]).optional(),
  })
  .refine((value) => Boolean(value.targetPlan || value.planName != null), {
    message: missingPlanMessage,
    path: ['targetPlan'],
  });

export type RenewSubscriptionDto = z.infer<typeof renewSubscriptionSchema>;
export type ChangePlanDto = z.infer<typeof changePlanSchema>;
