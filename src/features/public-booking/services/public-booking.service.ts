import { apiClient } from 'app/api';
import type { AppointmentDto } from 'shared/models';

import type { PublicCreateAppointmentDto, PublicServiceBookingDto } from '../types/public-booking';

const buildPublicServicePath = (slug: string, code: string, suffix = '') =>
  `/public/services/${encodeURIComponent(slug)}/${encodeURIComponent(code)}${suffix}`;

export const publicBookingService = {
  getService: (slug: string, code: string) =>
    apiClient
      .get<PublicServiceBookingDto>(buildPublicServicePath(slug, code))
      .then((response) => response.data),

  getAvailableDates: (slug: string, code: string, from: string, to: string) =>
    apiClient
      .get<string[]>(buildPublicServicePath(slug, code, '/available-dates'), {
        params: { from, to },
      })
      .then((response) => response.data),

  getAvailableSlots: (slug: string, code: string, date: string) =>
    apiClient
      .get<string[]>(buildPublicServicePath(slug, code, '/available-slots'), {
        params: { date },
      })
      .then((response) => response.data),

  createAppointment: (slug: string, code: string, dto: PublicCreateAppointmentDto) =>
    apiClient
      .post<AppointmentDto>(buildPublicServicePath(slug, code, '/appointments'), dto)
      .then((response) => response.data),
};
