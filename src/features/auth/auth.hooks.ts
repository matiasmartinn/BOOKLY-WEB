import { useMutation } from '@tanstack/react-query';
import { authService } from './auth.service';
import type { ProblemDetails } from 'app/api';
import type { RegisterUserRequst } from './register-form/register-user.schema';
import type { LoginRequest } from './login-form/login.schema';
import type { UserModel } from 'shared/models';

export const useRegister = () => {
  return useMutation<void, ProblemDetails, Omit<RegisterUserRequst, 'confirmPassword'>>({
    mutationFn: authService.create,
  });
};

export const useLogin = () => {
  return useMutation<UserModel, ProblemDetails, LoginRequest>({
    mutationFn: authService.login,
  });
};

export const useRecoverAccount = () => {
  return useMutation<void, ProblemDetails, string>({
    mutationFn: authService.recoverAccount,
  });
};
