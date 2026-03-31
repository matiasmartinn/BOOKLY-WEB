import { apiClient } from 'app/api';
import type { UserDto } from 'shared/models';
import type { LoginRequest } from '../login-form/login.schema';
import type { RegisterUserRequst } from '../register-form/register-user.schema';

export interface EmailDispatchResultDto {
  emailSent: boolean;
  message: string;
}

export interface RegisterOwnerResultDto {
  user: UserDto;
  emailDispatch: EmailDispatchResultDto;
}

export interface ConfirmEmailDto {
  token: string;
}

export interface ResendEmailConfirmationDto {
  email: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface CompleteSecretaryInvitationDto {
  token: string;
  password: string;
}

const register = (dto: Omit<RegisterUserRequst, 'confirmPassword'>) =>
  apiClient.post<RegisterOwnerResultDto>('/auth/register', dto).then((response) => response.data);

const login = (dto: LoginRequest) =>
  apiClient.post<UserDto>('/auth/login', dto).then((response) => response.data);

const confirmEmail = (dto: ConfirmEmailDto) =>
  apiClient.post<void>('/auth/confirm-email', dto).then((response) => response.data);

const resendConfirmation = (dto: ResendEmailConfirmationDto) =>
  apiClient.post<EmailDispatchResultDto>('/auth/resend-confirmation', dto).then((response) => response.data);

const forgotPassword = (dto: RequestPasswordResetDto) =>
  apiClient.post<void>('/auth/forgot-password', dto).then((response) => response.data);

const resetPassword = (dto: ResetPasswordDto) =>
  apiClient.post<void>('/auth/reset-password', dto).then((response) => response.data);

const completeSecretaryInvitation = (dto: CompleteSecretaryInvitationDto) =>
  apiClient
    .post<UserDto>('/auth/secretary-invitations/complete', dto)
    .then((response) => response.data);

export const authService = {
  create: register,
  register,
  login,
  confirmEmail,
  resendConfirmation,
  forgotPassword,
  recoverAccount: (email: string) => forgotPassword({ email }),
  resetPassword,
  completeSecretaryInvitation,
};
