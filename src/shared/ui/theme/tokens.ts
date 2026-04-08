import type { MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
  '#eef2ff',
  '#dfe7ff',
  '#c3d0ff',
  '#9eb2ff',
  '#7a95ff',
  '#5d78ff',
  '#4e63f5',
  '#3e4fd0',
  '#3341a9',
  '#2b377f',
];

const violetAccent: MantineColorsTuple = [
  '#faf5ff',
  '#f3e8ff',
  '#e9d5ff',
  '#d8b4fe',
  '#c084fc',
  '#a855f7',
  '#9333ea',
  '#7e22ce',
  '#6b21a8',
  '#581c87',
];

const success: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d',
];

const warning: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#f59e0b',
  '#d97706',
  '#b45309',
  '#92400e',
  '#78350f',
];

const error: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
];

const info: MantineColorsTuple = [
  '#ecfeff',
  '#cffafe',
  '#a5f3fc',
  '#67e8f9',
  '#22d3ee',
  '#06b6d4',
  '#0891b2',
  '#0e7490',
  '#155e75',
  '#164e63',
];

export const appColorTuples = {
  brand,
  violetAccent,
  success,
  warning,
  error,
  info,
} as const;

export const appColorVars = {
  background: 'var(--app-color-background)',
  backgroundAlt: 'var(--app-color-background-alt)',
  surface: 'var(--app-color-surface)',
  surfaceHover: 'var(--app-color-surface-hover)',
  surfaceSoft: 'var(--app-color-surface-soft)',
  border: 'var(--app-color-border)',
  borderSoft: 'var(--app-color-border-soft)',
  textPrimary: 'var(--app-color-text-primary)',
  textSecondary: 'var(--app-color-text-secondary)',
  textMuted: 'var(--app-color-text-muted)',
  brandSoft: 'var(--app-color-brand-soft)',
  brandSoftHover: 'var(--app-color-brand-soft-hover)',
  brandOutline: 'var(--app-color-brand-outline)',
  violetSoft: 'var(--app-color-violet-soft)',
  successSoft: 'var(--app-color-success-soft)',
  warningSoft: 'var(--app-color-warning-soft)',
  errorSoft: 'var(--app-color-error-soft)',
  infoSoft: 'var(--app-color-info-soft)',
  grid: 'var(--app-color-grid)',
  overlay: 'var(--app-color-overlay)',
  gradientBrand: 'var(--app-gradient-brand)',
  shadowPanel: 'var(--app-shadow-panel)',
  shadowFloating: 'var(--app-shadow-floating)',
} as const;

export const appChartColorVars = {
  primary: 'var(--mantine-color-brand-5)',
  primaryStrong: 'var(--mantine-color-brand-6)',
  primarySoft: 'var(--app-color-brand-soft)',
  violet: 'var(--mantine-color-violetAccent-5)',
  success: 'var(--mantine-color-success-5)',
  warning: 'var(--mantine-color-warning-5)',
  danger: 'var(--mantine-color-error-5)',
  info: 'var(--mantine-color-info-4)',
  muted: 'var(--app-color-text-muted)',
  axis: 'var(--app-color-text-muted)',
  grid: 'var(--app-color-grid)',
} as const;

export const appChartTooltipStyles = {
  contentStyle: {
    backgroundColor: appColorVars.surface,
    border: `1px solid ${appColorVars.border}`,
    borderRadius: '14px',
    boxShadow: appColorVars.shadowFloating,
  },
  labelStyle: {
    color: appColorVars.textPrimary,
  },
  itemStyle: {
    color: appColorVars.textPrimary,
  },
} as const;

export const appSemanticColors = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  pending: 'brand',
  neutral: 'gray',
  accent: 'violetAccent',
} as const;
