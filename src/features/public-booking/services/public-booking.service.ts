import { apiClient } from 'app/api';
import type { AppointmentDto } from 'shared/models';

import type { PublicCreateAppointmentDto, PublicServiceBookingDto } from '../types/public-booking';

const buildPublicServicePath = (slug: string, token: string, suffix = '') =>
  `/public/services/${encodeURIComponent(slug)}/${encodeURIComponent(token)}${suffix}`;

export const publicBookingService = {
  getService: (slug: string, token: string) =>
    apiClient
      .get<PublicServiceBookingDto>(buildPublicServicePath(slug, token))
      .then((response) => response.data),

  getAvailableDates: (slug: string, token: string, from: string, to: string) =>
    apiClient
      .get<string[]>(buildPublicServicePath(slug, token, '/available-dates'), {
        params: { from, to },
      })
      .then((response) => response.data),

  getAvailableSlots: (slug: string, token: string, date: string) =>
    apiClient
      .get<string[]>(buildPublicServicePath(slug, token, '/available-slots'), {
        params: { date },
      })
      .then((response) => response.data),

  createAppointment: (slug: string, token: string, dto: PublicCreateAppointmentDto) =>
    apiClient
      .post<AppointmentDto>(buildPublicServicePath(slug, token, '/appointments'), dto)
      .then((response) => response.data),
};
