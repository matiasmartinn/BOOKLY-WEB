import type { DynamicFieldDefinitionDto } from 'shared/models';
import {
  buildAppointmentSchema,
  createAppointmentFormDefaultValues,
  type AppointmentFormValuesBase,
} from 'shared/utils';

export type AppointmentFormValues = AppointmentFormValuesBase;

export const appointmentFormDefaultValues = createAppointmentFormDefaultValues;

export const createAppointmentFormSchema = (options: {
  canUseDynamicFields: boolean;
  fieldDefinitions: DynamicFieldDefinitionDto[];
}) => buildAppointmentSchema(options);
