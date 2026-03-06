import { Stack, Title, Text, TextInput, PasswordInput, Button, Anchor } from '@mantine/core';
import { PATHS } from 'app/router';
import { Link } from 'react-router-dom';
import { AuthCard } from 'shared/ui';

export function LoginForm() {
  return (
    <AuthCard onSubmit={() => {}}>
      <Stack gap="md" align="strech">
        <Stack gap={4} align="center">
          <Title order={3}>Iniciar Sesión</Title>
          <Text size="sm" c="dimmed">
            Ingrese las credenciales de su cuenta.
          </Text>
        </Stack>

        <Stack gap="md">
          <TextInput label="Email" placeholder="Ingrese su Email..." error={undefined} />

          <Stack gap="xs">
            <PasswordInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              error={undefined}
            />
            <Text size="sm" c="dimmed">
              ¿Olvidaste tu contraseña?{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.forgotPassword}>
                {' '}
                Recuperala
              </Anchor>
            </Text>
          </Stack>

          <Stack gap="xs" align="center">
            <Button type="submit">Ingresar</Button>
            <Text size="sm" c="dimmed" ta="center">
              ¿No tenes cuenta?{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.register}>
                Registrate
              </Anchor>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </AuthCard>
  );
}
