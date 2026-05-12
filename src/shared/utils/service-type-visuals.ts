import {
  faBookOpen,
  faBriefcase,
  faDumbbell,
  faHeartPulse,
  faLayerGroup,
  faScissors,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

export const SERVICE_TYPE_DEFAULT_COLOR_HEX = '#7C5CFF';

export const SERVICE_TYPE_ICON_KEYS = [
  'scissors',
  'heart-pulse',
  'dumbbell',
  'book-open',
  'briefcase',
  'sparkles',
] as const;

export type ServiceTypeIconKey = (typeof SERVICE_TYPE_ICON_KEYS)[number];

export const SERVICE_TYPE_ICON_OPTIONS: Array<{ value: ServiceTypeIconKey; label: string }> = [
  { value: 'scissors', label: 'Peluqueria / barberia' },
  { value: 'heart-pulse', label: 'Salud' },
  { value: 'dumbbell', label: 'Entrenamiento' },
  { value: 'book-open', label: 'Clases' },
  { value: 'briefcase', label: 'Asesoria' },
  { value: 'sparkles', label: 'Estetica / terapias' },
];

export const SERVICE_TYPE_COLOR_SWATCHES = [
  '#E11D48',
  '#0F766E',
  '#7C3AED',
  '#0284C7',
  '#16A34A',
  '#0891B2',
  '#D97706',
  '#DB2777',
  '#EA580C',
  '#6548E6',
  '#475569',
  '#9333EA',
  SERVICE_TYPE_DEFAULT_COLOR_HEX,
];

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

const SERVICE_TYPE_ICONS = {
  scissors: faScissors,
  'heart-pulse': faHeartPulse,
  dumbbell: faDumbbell,
  'book-open': faBookOpen,
  briefcase: faBriefcase,
  sparkles: faWandMagicSparkles,
} satisfies Record<ServiceTypeIconKey, typeof faScissors>;

export const isServiceTypeIconKey = (iconKey?: string | null): iconKey is ServiceTypeIconKey =>
  SERVICE_TYPE_ICON_KEYS.includes(iconKey as ServiceTypeIconKey);

export const getServiceTypeColor = (colorHex?: string | null) => {
  const normalized = colorHex?.trim();
  return normalized && HEX_COLOR_PATTERN.test(normalized)
    ? normalized.toUpperCase()
    : SERVICE_TYPE_DEFAULT_COLOR_HEX;
};

export const getServiceTypeSoftColor = (colorHex?: string | null) =>
  `${getServiceTypeColor(colorHex)}18`;

export const getServiceTypeIcon = (iconKey?: string | null) =>
  isServiceTypeIconKey(iconKey) ? SERVICE_TYPE_ICONS[iconKey] : faLayerGroup;
