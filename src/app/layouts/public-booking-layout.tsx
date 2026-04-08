import { Anchor, Box, Container, Group, Stack, Text } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { Link, Outlet } from 'react-router-dom';

export function PublicBookingLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(238, 242, 255, 0.92) 52%, rgba(248, 250, 252, 0.98) 100%)',
      }}
    >
      <Box
        component="header"
        style={{
          borderBottom: '1px solid var(--app-color-border)',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Container size="lg" py="md">
          <Anchor component={Link} to={PATHS.public.home} underline="never" c="inherit">
            <Group gap="sm" wrap="nowrap">
              <Box
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  color: 'white',
                  fontWeight: 800,
                  backgroundColor: 'var(--mantine-color-brand-6)',
                  boxShadow: '0 14px 28px rgba(79, 70, 229, 0.22)',
                  flexShrink: 0,
                }}
              >
                B
              </Box>

              <Stack gap={0}>
                <Text fw={800} c="brand.7">
                  Bookly
                </Text>
                <Text size="xs" c="dimmed">
                  Reserva online
                </Text>
              </Stack>
            </Group>
          </Anchor>
        </Container>
      </Box>

      <Box component="main" py={{ base: 'xl', sm: '2.5rem' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
