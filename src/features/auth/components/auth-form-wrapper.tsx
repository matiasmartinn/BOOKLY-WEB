import { Box, Stack, Title, type BoxProps } from '@mantine/core';
import type { ReactNode } from 'react';
import classes from './auth-form-wrapper.module.css';

interface AuthFormWrapperProps extends BoxProps {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  title: ReactNode;
  children: ReactNode;
}

export function AuthFormWrapper({
  onSubmit,
  title,
  children,
  className,
  ...boxProps
}: AuthFormWrapperProps) {
  const resolvedClassName = className ? `${classes.panel} ${className}` : classes.panel;

  return (
    <Box component="form" noValidate onSubmit={onSubmit} className={resolvedClassName} {...boxProps}>
      <Stack gap="xl">
        <Stack gap="sm" className={classes.header}>
          <Title order={1} className={classes.title}>
            {title}
          </Title>
        </Stack>

        {children}
      </Stack>
    </Box>
  );
}
