import { apiClient } from 'app/api';
import type { UserModel } from 'shared/models';
import type { RegisterUserRequst } from './register-form/register-user.schema';
import type { LoginRequest } from './login-form/login.schema';

export const authService = {
  create: (dto: Omit<RegisterUserRequst, 'confirmPassword'>) =>
    apiClient.post('/Auth/register', dto).then((r) => r.data),

  login: (dto: LoginRequest) => apiClient.post<UserModel>('/Auth/login', dto).then((r) => r.data),

  recoverAccount: (email: string) =>
    apiClient.post('/Auth/recoverPassword', { email }).then((r) => r.data),
};
