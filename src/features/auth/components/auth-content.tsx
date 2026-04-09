import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import { AuthBrand } from './auth-brand';
import classes from './auth-shell.module.css';

interface AuthContentProps {
  children: ReactNode;
}

export function AuthContent({ children }: AuthContentProps) {
  return (
    <main className={classes.content}>
      <Box className={classes.contentInner}>
        <div className={classes.mobileBrand}>
          <AuthBrand light compact />
        </div>

        {children}
      </Box>
    </main>
  );
}
