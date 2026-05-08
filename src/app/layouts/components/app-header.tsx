import { Box, Button, Container, Group, Text } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { Link } from 'react-router-dom';
import { useAuthStore } from 'store/use-auth-store';

export function AppHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Container size="lg" h="100%">
      <Group h="100%" justify="space-between" align="center" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Box
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 36,
              height: 36,
              borderRadius: 12,
              color: 'white',
              fontWeight: 800,
              backgroundColor: 'var(--mantine-color-brand-6)',
              flexShrink: 0,
            }}
          >
            B
          </Box>

          <Text
            component={Link}
            to="/"
            td="none"
            size="md"
            fw={800}
            c="brand.6"
            style={{ whiteSpace: 'nowrap' }}
          >
            Bookly
          </Text>
        </Group>

        {!isAuthenticated ? (
          <Group gap={6} wrap="nowrap">
            <Button variant="subtle" color="brand" component={Link} to={PATHS.auth.login} size="xs">
              Iniciar sesion
            </Button>
            <Button color="brand" component={Link} to={PATHS.auth.register} size="xs">
              Registrarse
            </Button>
          </Group>
        ) : (
          <Button color="brand" component={Link} to={PATHS.dashboard.overview} size="xs">
            Iniciar sesion
          </Button>
        )}
      </Group>
    </Container>
  );
}
