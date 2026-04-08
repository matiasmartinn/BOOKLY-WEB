export interface ServicePublicBookingDto {
  serviceId: number;
  slug: string;
  isEnabled: boolean;
  publicBookingToken: string;
  publicBookingTokenUpdatedAt?: string | null;
  publicUrl: string;
}
