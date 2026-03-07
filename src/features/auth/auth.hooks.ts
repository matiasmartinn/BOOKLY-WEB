import { useMutation } from '@tanstack/react-query';
import { authService } from './auth.services';

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.create,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};
