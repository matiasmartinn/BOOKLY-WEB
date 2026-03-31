import type { AppointmentListItemDto } from './appointment-dto';

export interface ClientListItemDto {
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastAppointmentDateTime?: string | null;
  nextAppointmentDateTime?: string | null;
}

export interface ClientDetailDto {
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  firstAppointmentDateTime?: string | null;
  lastAppointmentDateTime?: string | null;
  nextAppointmentDateTime?: string | null;
  servicesUsed: string[];
}

export type ClientAppointmentHistoryDto = AppointmentListItemDto;
