import type { DynamicFieldDefinitionDto } from 'shared/models';
import {
  buildAppointmentSchema,
  createAppointmentFormDefaultValues,
  type AppointmentFormValuesBase,
} from 'shared/utils';

export type PublicAppointmentFormValues = AppointmentFormValuesBase;

export const createPublicAppointmentDefaultValues = createAppointmentFormDefaultValues;

export const createPublicAppointmentSchema = (options: {
  canUseDynamicFields: boolean;
  fieldDefinitions: DynamicFieldDefinitionDto[];
}) => buildAppointmentSchema(options);
