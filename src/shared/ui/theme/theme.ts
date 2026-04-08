import { createTheme } from '@mantine/core';
import { appColorTuples } from './tokens';

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
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
  },
});
