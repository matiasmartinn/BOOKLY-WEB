// core/providers/AppProvider.tsx
import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { appTheme } from 'shared/ui/theme/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'app/api';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProviderProps) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={appTheme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  </QueryClientProvider>
);
