// core/providers/AppProvider.tsx
import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { appTheme } from 'shared/ui/theme/theme';

interface AppProviderProps {
  children: ReactNode;
}
export const AppProviders = ({ children }: AppProviderProps) => (
  <MantineProvider theme={appTheme} defaultColorScheme="auto">
    {children}
  </MantineProvider>
);
