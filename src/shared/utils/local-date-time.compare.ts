import { normalizeDateOnly, normalizeLocalDateTime } from './local-date-time.normalize';

export const compareDateOnly = (left?: string | null, right?: string | null) => {
  const normalizedLeft = normalizeDateOnly(left);
  const normalizedRight = normalizeDateOnly(right);

  if (!normalizedLeft && !normalizedRight) {
    return 0;
  }

  if (!normalizedLeft) {
    return -1;
  }

  if (!normalizedRight) {
    return 1;
  }

  return normalizedLeft.localeCompare(normalizedRight);
};

export const compareLocalDateTime = (left?: string | null, right?: string | null) => {
  const normalizedLeft = normalizeLocalDateTime(left);
  const normalizedRight = normalizeLocalDateTime(right);

  if (!normalizedLeft && !normalizedRight) {
    return 0;
  }

  if (!normalizedLeft) {
    return -1;
  }

  if (!normalizedRight) {
    return 1;
  }

  return normalizedLeft.localeCompare(normalizedRight);
};
