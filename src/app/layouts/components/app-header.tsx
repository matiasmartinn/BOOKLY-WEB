import { Box, Button, Container, Group, Text } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { Link } from 'react-router-dom';
import { useAuthStore } from 'store/use-auth-store';

const headerActionStyles = {
  root: {
    height: 40,
    paddingInline: 14,
    borderRadius: 10,
    color: 'rgba(248, 250, 252, 0.92)',
    background: 'transparent',
    borderColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: 'none',
  },
} as const;

const headerPrimaryStyles = {
  root: {
    height: 40,
    paddingInline: 18,
    borderRadius: 10,
    color: '#ffffff',
    background: '#5963c7',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'none',
  },
} as const;

export function AppHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Box h="100%">
      <Container size="lg" h="100%">
        <Group h="100%" justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Box
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 38,
                height: 38,
                borderRadius: 12,
                color: '#ffffff',
                fontWeight: 800,
                background:
                  'linear-gradient(180deg, rgba(116, 127, 225, 0.96) 0%, rgba(84, 95, 198, 0.96) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: '0 6px 16px rgba(18, 24, 54, 0.18)',
                flexShrink: 0,
              }}
            >
              B
            </Box>

            <Text
              component={Link}
              to="/"
              td="none"
              size="lg"
              fw={800}
              style={{
                color: 'rgba(255, 255, 255, 0.98)',
                whiteSpace: 'nowrap',
              }}
            >
              Bookly
            </Text>
          </Group>

          {!isAuthenticated ? (
            <Group gap={8} wrap="nowrap">
              <Button
                component={Link}
                to={PATHS.auth.register}
                size="sm"
                styles={headerPrimaryStyles}
                className="btnPrimary"
              >
                Registrarse
              </Button>
              <Button
                component={Link}
                to={PATHS.auth.login}
                size="sm"
                variant="outline"
                styles={headerActionStyles}
                className="btnAction"
              >
                Iniciar sesion
              </Button>
            </Group>
          ) : (
            <Button
              component={Link}
              to={PATHS.dashboard.overview}
              size="sm"
              styles={headerPrimaryStyles}
              className="btnAction"
            >
              Ir al dashboard
            </Button>
          )}
        </Group>
      </Container>
    </Box>
  );
}
