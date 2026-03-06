import { Group, Button, Text } from '@mantine/core';

export function AppHeader() {
  return (
    <Group h="100%" px="md" justify="space-between" align="center">
      <Text fw={800} c="brand.6">
        Bookly
      </Text>

      <Group gap="xs">
        <Button variant="subtle" color="brand" component="a" href="/auth/register">
          Registrarme
        </Button>
        <Button color="brand" component="a" href="/auth/login">
          Iniciar sesión
        </Button>
      </Group>
    </Group>
  );
}
