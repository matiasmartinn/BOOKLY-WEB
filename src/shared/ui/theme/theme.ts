import { createTheme } from '@mantine/core';

export const appTheme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',

  colors: {
    brand: [
      '#eef2ff',
      '#e0e7ff',
      '#c7d2fe',
      '#a5b4fc',
      '#818cf8',
      '#6366f1',
      '#4f46e5',
      '#4338ca',
      '#3730a3',
      '#312e81',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
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
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
  },
});
