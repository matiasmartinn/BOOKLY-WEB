import { Paper } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageCardProps {
  children: ReactNode;
}

export function PageCard({ children }: PageCardProps) {
  return (
    <Paper
      radius="xl"
      p="xl"
      withBorder
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, var(--app-color-background-alt) 100%)',
        borderColor: 'var(--app-color-border)',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.07)',
      }}
    >
      {children}
    </Paper>
  );
}
