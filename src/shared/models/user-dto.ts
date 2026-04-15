export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  serviceIds: number[];
}

export interface EmailDispatchResultDto {
  emailSent: boolean;
  message: string;
}

export interface UserEmailDispatchResultDto {
  user: UserDto;
  emailDispatch: EmailDispatchResultDto;
}

export interface SecretaryDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isActive: boolean;
  emailConfirmed: boolean;
  serviceIds: number[];
}

export type UserModel = UserDto;
