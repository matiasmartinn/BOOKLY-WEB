export interface PublicBookingAccessFields {
  publicBookingCode?: string | null;
  publicBookingCodeUpdatedAt?: string | null;
  publicBookingToken?: string | null;
  publicBookingTokenUpdatedAt?: string | null;
  publicBookingTokenUpdateAt?: string | null;
}

const shortPublicBookingCodePattern = /^[A-Za-z0-9]{8}$/;
const legacyPublicBookingTokenPattern = /^[a-f0-9]{24,}$/i;

export const resolvePublicBookingCode = (value: PublicBookingAccessFields) => {
  const currentCode = value.publicBookingCode?.trim();

  if (currentCode) {
    return currentCode;
  }

  const legacyToken = value.publicBookingToken?.trim();

  if (legacyToken) {
    return legacyToken;
  }

  return '';
};

export const resolvePublicBookingCodeUpdatedAt = (value: PublicBookingAccessFields) =>
  value.publicBookingCodeUpdatedAt ??
  value.publicBookingTokenUpdatedAt ??
  value.publicBookingTokenUpdateAt ??
  null;

export const isLegacyPublicBookingToken = (value?: string | null) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return false;
  }

  return (
    !shortPublicBookingCodePattern.test(normalizedValue) &&
    legacyPublicBookingTokenPattern.test(normalizedValue)
  );
};
