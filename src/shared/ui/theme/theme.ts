import { createTheme, rem } from '@mantine/core';

import { appColorTuples, appColorVars } from './tokens';

export { appChartColorVars, appChartTooltipStyles, appColorVars } from './tokens';

export const appTheme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },
  colors: {
    brand: appColorTuples.brand,
    violetAccent: appColorTuples.violetAccent,
    success: appColorTuples.success,
    warning: appColorTuples.warning,
    error: appColorTuples.error,
    info: appColorTuples.info,
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: 0,
          transition:
            'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease, border-color 140ms ease',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
          },
          '&:focus-visible': {
            outline: `2px solid var(--mantine-color-brand-5)`,
            outlineOffset: rem(2),
          },
        },
      },
    },
    Input: {
      styles: {
        input: {
          backgroundColor: appColorVars.backgroundAlt,
          border: `1px solid ${appColorVars.border}`,
          color: appColorVars.textPrimary,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
          transition: 'border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease',
          '&::placeholder': {
            color: appColorVars.textMuted,
            opacity: 0.92,
          },
          '&:focus, &:focusWithin': {
            borderColor: 'var(--mantine-color-brand-5)',
            boxShadow: `0 0 0 ${rem(3)} var(--app-color-brand-soft)`,
          },
          '&[readonly]': {
            backgroundColor: appColorVars.surfaceSoft,
            color: appColorVars.textSecondary,
            borderColor: appColorVars.borderSoft,
          },
          '&[dataDisabled]': {
            backgroundColor: 'var(--mantine-color-gray-0)',
            color: appColorVars.textMuted,
          },
        },
      },
    },
    InputWrapper: {
      styles: {
        label: {
          marginBottom: rem(6),
          fontSize: rem(14),
          fontWeight: 600,
          color: appColorVars.textPrimary,
        },
        description: {
          marginTop: rem(6),
          fontSize: rem(13),
          color: appColorVars.textSecondary,
          lineHeight: 1.45,
        },
        error: {
          marginTop: rem(6),
          fontSize: rem(13),
          lineHeight: 1.4,
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Checkbox: {
      defaultProps: {
        radius: 'sm',
        color: 'brand',
      },
      styles: {
        label: {
          color: appColorVars.textPrimary,
          fontWeight: 500,
        },
        description: {
          color: appColorVars.textSecondary,
          lineHeight: 1.45,
        },
        input: {
          borderColor: appColorVars.borderSoft,
        },
      },
    },
    Switch: {
      defaultProps: {
        color: 'brand',
        size: 'md',
      },
      styles: {
        label: {
          color: appColorVars.textPrimary,
          fontWeight: 600,
        },
        description: {
          color: appColorVars.textSecondary,
          lineHeight: 1.45,
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        color: 'brand',
      },
      styles: {
        root: {
          '&:focus-visible': {
            outline: `2px solid var(--mantine-color-brand-5)`,
            outlineOffset: rem(2),
          },
        },
      },
    },
    Anchor: {
      defaultProps: {
        c: 'brand.6',
      },
    },
    Pagination: {
      defaultProps: {
        color: 'brand',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: appColorVars.surface,
          borderColor: appColorVars.border,
        },
      },
    },
  },
});
