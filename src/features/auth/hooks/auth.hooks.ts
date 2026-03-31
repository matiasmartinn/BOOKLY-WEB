import { useMutation } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { UserDto } from 'shared/models';
import type { LoginRequest } from '../login-form/login.schema';
import type { RegisterUserRequst } from '../register-form/register-user.schema';
import {
  authService,
  type CompleteSecretaryInvitationDto,
  type ConfirmEmailDto,
  type EmailDispatchResultDto,
  type RegisterOwnerResultDto,
  type RequestPasswordResetDto,
  type ResendEmailConfirmationDto,
  type ResetPasswordDto,
} from '../services';

export const useRegister = () =>
  useMutation<RegisterOwnerResultDto, ProblemDetails, Omit<RegisterUserRequst, 'confirmPassword'>>({
    mutationFn: authService.register,
  });

export const useLogin = () =>
  useMutation<UserDto, ProblemDetails, LoginRequest>({
    mutationFn: authService.login,
  });

export const useConfirmEmail = () =>
  useMutation<void, ProblemDetails, ConfirmEmailDto>({
    mutationFn: authService.confirmEmail,
  });

export const useResendConfirmation = () =>
  useMutation<EmailDispatchResultDto, ProblemDetails, ResendEmailConfirmationDto>({
    mutationFn: authService.resendConfirmation,
  });

export const useForgotPassword = () =>
  useMutation<void, ProblemDetails, RequestPasswordResetDto>({
    mutationFn: authService.forgotPassword,
  });

export const useRecoverAccount = () =>
  useMutation<void, ProblemDetails, string>({
    mutationFn: authService.recoverAccount,
  });

export const useResetPassword = () =>
  useMutation<void, ProblemDetails, ResetPasswordDto>({
    mutationFn: authService.resetPassword,
  });

export const useCompleteSecretaryInvitation = () =>
  useMutation<UserDto, ProblemDetails, CompleteSecretaryInvitationDto>({
    mutationFn: authService.completeSecretaryInvitation,
  });
