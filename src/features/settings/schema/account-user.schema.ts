import type { UpdateUserProfileFormValues } from 'features/users/schema';
import { updateUserProfileSchema } from 'features/users/schema';

export const accountUserSchema = updateUserProfileSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
});

export type AccountUserFormValues = Pick<
  UpdateUserProfileFormValues,
  'firstName' | 'lastName' | 'email'
>;
