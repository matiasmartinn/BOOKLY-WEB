// app/pages/auth/AuthLayout.tsx
import { Center, Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="lg">
        {/* Logo acá cuando lo tengas */}
        <Outlet />
      </Stack>
    </Center>
  );
}
