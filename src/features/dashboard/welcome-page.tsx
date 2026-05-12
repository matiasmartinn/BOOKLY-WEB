import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useAuthStore } from 'store/use-auth-store';

function getDisplayName(firstName?: string, fullName?: string): string {
  const resolvedFirstName = firstName?.trim();

  if (resolvedFirstName) {
    return resolvedFirstName;
  }

  return fullName?.trim() || 'usuario';
}

export function WelcomePage() {
  const authUser = useAuthStore((state) => state.user);
  const displayName = useMemo(
    () => getDisplayName(authUser?.firstName, authUser?.fullName),
    [authUser?.firstName, authUser?.fullName],
  );

  return (
    <Center mih="calc(100dvh - 120px)" px={{ base: 0, sm: 'md' }}>
      <Paper
        w="100%"
        maw={620}
        p={{ base: 'xl', sm: 44 }}
        radius="xl"
        withBorder
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, var(--app-color-background-alt) 100%)',
          borderColor: 'var(--app-color-border)',
          boxShadow: 'var(--app-shadow-panel)',
        }}
      >
        <Stack gap="lg" align="center" ta="center">
          <ThemeIcon size={64} radius="xl" variant="light" color="brand">
            <FontAwesomeIcon icon={faUserCheck} size="lg" />
          </ThemeIcon>

          <Stack gap="xs">
            <Title
              order={2}
              style={{
                color: 'var(--app-color-text-primary)',
                letterSpacing: 0,
              }}
            >
              Bienvenido, {displayName}
            </Title>

            <Text size="md" style={{ color: 'var(--app-color-text-secondary)', lineHeight: 1.6 }}>
              Todavia no tenes permisos asignados para operar en este servicio.
            </Text>

            <Text size="sm" style={{ color: 'var(--app-color-text-muted)', lineHeight: 1.55 }}>
              Cuando el propietario te habilite permisos, vas a ver disponibles las secciones
              correspondientes en el menu lateral.
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  );
}
