import { apiClient } from 'app/api/api-client';
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

export interface CompleteAdminInvitationDto {
  token: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  role: string;
  fullName: string;
  accessTokenExpiresAt: string | null;
}

export interface AuthenticatedSessionResult {
  session: AuthSession;
  user: UserDto;
}

const publicAuthRequestConfig = {
  skipAuth: true,
  skipAuthRefresh: true,
};

function getAccessTokenExpiresAt(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '=',
    );
    const decodedPayload = globalThis.atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as { exp?: number };

    return typeof parsedPayload.exp === 'number'
      ? new Date(parsedPayload.exp * 1000).toISOString()
      : null;
  } catch {
    return null;
  }
}

function toAuthSession(response: AuthResponseDto): AuthSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    userId: response.userId,
    email: response.email,
    role: response.role,
    fullName: response.fullName,
    accessTokenExpiresAt: getAccessTokenExpiresAt(response.accessToken),
  };
}

async function getAuthenticatedUser(userId: number, accessToken: string): Promise<UserDto> {
  const response = await apiClient.get<UserDto>(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    skipAuthRefresh: true,
  });

  return response.data;
}

const register = (dto: Omit<RegisterUserRequst, 'confirmPassword'>) =>
  apiClient
    .post<RegisterOwnerResultDto>('/auth/register', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const login = async (dto: LoginRequest): Promise<AuthenticatedSessionResult> => {
  const response = await apiClient.post<AuthResponseDto>('/auth/login', dto, publicAuthRequestConfig);
  const session = toAuthSession(response.data);
  const user = await getAuthenticatedUser(session.userId, session.accessToken);

  return { session, user };
};

const refreshSession = async (refreshToken: string): Promise<AuthenticatedSessionResult> => {
  const response = await apiClient.post<AuthResponseDto>(
    '/auth/refresh',
    { refreshToken },
    publicAuthRequestConfig,
  );
  const session = toAuthSession(response.data);
  const user = await getAuthenticatedUser(session.userId, session.accessToken);

  return { session, user };
};

const logout = (refreshToken: string) =>
  apiClient
    .post<void>(
      '/auth/logout',
      { refreshToken },
      {
        skipAuthRefresh: true,
      },
    )
    .then((response) => response.data);

const confirmEmail = (dto: ConfirmEmailDto) =>
  apiClient
    .post<void>('/auth/confirm-email', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const resendConfirmation = (dto: ResendEmailConfirmationDto) =>
  apiClient
    .post<EmailDispatchResultDto>('/auth/resend-confirmation', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const forgotPassword = (dto: RequestPasswordResetDto) =>
  apiClient
    .post<void>('/auth/forgot-password', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const resetPassword = (dto: ResetPasswordDto) =>
  apiClient
    .post<void>('/auth/reset-password', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const completeSecretaryInvitation = (dto: CompleteSecretaryInvitationDto) =>
  apiClient
    .post<UserDto>('/auth/secretary-invitations/complete', dto, publicAuthRequestConfig)
    .then((response) => response.data);

const completeAdminInvitation = (dto: CompleteAdminInvitationDto) =>
  apiClient
    .post<UserDto>('/admins/complete-invitation', dto, publicAuthRequestConfig)
    .then((response) => response.data);

export const authService = {
  create: register,
  register,
  login,
  refreshSession,
  logout,
  confirmEmail,
  resendConfirmation,
  forgotPassword,
  recoverAccount: (email: string) => forgotPassword({ email }),
  resetPassword,
  completeSecretaryInvitation,
  completeAdminInvitation,
};
