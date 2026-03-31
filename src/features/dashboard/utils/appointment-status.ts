const normalizeStatusValue = (value?: string | null) =>
  value
    ?.trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_') ?? '';

export const normalizeAppointmentStatus = normalizeStatusValue;

export const getAppointmentStatusLabel = (value?: string | null) => {
  const normalized = normalizeStatusValue(value);

  if (!normalized) {
    return 'Sin estado';
  }

  if (normalized.includes('CANCEL')) return 'Cancelado';
  if (normalized.includes('NO_SHOW') || normalized.includes('NOSHOW')) return 'No asistio';
  if (normalized.includes('RESCHEDULE') || normalized.includes('REPROGRAM')) return 'Reprogramado';
  if (normalized.includes('ATTEND') || normalized.includes('CONFIRM')) return 'Asistio';
  if (normalized.includes('CREATED')) return 'Creado';
  if (normalized.includes('PENDING')) return 'Pendiente';

  return normalized
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
    .join(' ');
};

export const getAppointmentStatusColor = (value?: string | null) => {
  const normalized = normalizeStatusValue(value);

  if (normalized.includes('CANCEL')) return 'red';
  if (normalized.includes('NO_SHOW') || normalized.includes('NOSHOW')) return 'orange';
  if (normalized.includes('RESCHEDULE') || normalized.includes('REPROGRAM')) return 'blue';
  if (normalized.includes('ATTEND') || normalized.includes('CONFIRM')) return 'green';
  if (normalized.includes('CREATED') || normalized.includes('PENDING')) return 'indigo';

  return 'gray';
};

export const appointmentStatusIncludes = (
  value: string | null | undefined,
  ...keywords: string[]
) => {
  const normalized = normalizeStatusValue(value);
  return keywords.some((keyword) => normalized.includes(keyword));
};
