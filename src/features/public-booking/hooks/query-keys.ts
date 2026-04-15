export const publicBookingQueryKeys = {
  all: () => ['public-booking'] as const,
  access: (slug?: string, code?: string) => ['public-booking', slug ?? null, code ?? null] as const,
  service: (slug?: string, code?: string) =>
    [...publicBookingQueryKeys.access(slug, code), 'service'] as const,
  availableDates: (slug?: string, code?: string, from?: string, to?: string) =>
    [...publicBookingQueryKeys.access(slug, code), 'available-dates', from ?? null, to ?? null] as const,
  availableSlots: (slug?: string, code?: string, date?: string | null) =>
    [...publicBookingQueryKeys.access(slug, code), 'available-slots', date ?? null] as const,
};
