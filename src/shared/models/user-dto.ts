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
