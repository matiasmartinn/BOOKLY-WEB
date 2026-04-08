export const publicBookingQueryKeys = {
  all: () => ['public-booking'] as const,
  access: (slug?: string, token?: string) => ['public-booking', slug ?? null, token ?? null] as const,
  service: (slug?: string, token?: string) =>
    [...publicBookingQueryKeys.access(slug, token), 'service'] as const,
  availableDates: (slug?: string, token?: string, from?: string, to?: string) =>
    [...publicBookingQueryKeys.access(slug, token), 'available-dates', from ?? null, to ?? null] as const,
  availableSlots: (slug?: string, token?: string, date?: string | null) =>
    [...publicBookingQueryKeys.access(slug, token), 'available-slots', date ?? null] as const,
};
