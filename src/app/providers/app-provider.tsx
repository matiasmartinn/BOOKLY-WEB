// core/providers/AppProvider.tsx
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'app/api';
import type { ReactNode } from 'react';
import { appTheme } from 'shared/ui/theme/theme';
import { AppToastProvider } from 'shared/ui/toast';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProviderProps) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={appTheme} defaultColorScheme="light">
      <AppToastProvider>{children}</AppToastProvider>
    </MantineProvider>
  </QueryClientProvider>
);
