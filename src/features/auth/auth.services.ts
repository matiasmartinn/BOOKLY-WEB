import { apiClient } from 'app/axios';
import type { UserDto } from './auth.types';
import type { RegisterUserRequst } from './user-form/register-user.schema';
import type { LoginRequest } from './login-form/login-form.schema';

export const authService = {
  create: (dto: Omit<RegisterUserRequst, 'confirmPassword'>) =>
    apiClient.post<UserDto>('/user', dto).then((r) => r.data),
  login: (dto: LoginRequest) => apiClient.post<UserDto>('user/login', dto).then((r) => r.data),
};
