import type { PublicBookingAccessFields } from './public-booking-access';
import {
  resolvePublicBookingCode,
  resolvePublicBookingCodeUpdatedAt,
} from './public-booking-access';

export interface ServicePublicBookingDto {
  serviceId: number;
  slug: string;
  isEnabled: boolean;
  publicBookingCode: string;
  publicBookingCodeUpdatedAt?: string | null;
  publicUrl: string;
}

export interface ServicePublicBookingApiDto
  extends Omit<ServicePublicBookingDto, 'publicBookingCode' | 'publicBookingCodeUpdatedAt'>,
    PublicBookingAccessFields {}

export const normalizeServicePublicBookingDto = (
  publicBooking: ServicePublicBookingApiDto,
): ServicePublicBookingDto => ({
  ...publicBooking,
  publicBookingCode: resolvePublicBookingCode(publicBooking),
  publicBookingCodeUpdatedAt: resolvePublicBookingCodeUpdatedAt(publicBooking),
});
