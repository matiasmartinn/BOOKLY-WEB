import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Container size="sm" py={{ base: 'xl', sm: '3rem' }}>
      <Paper p={{ base: 'xl', sm: '2rem' }} radius="xl" withBorder>
        <Stack gap="md">
          <Text
            size="xs"
            fw={700}
            c="brand.7"
            style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Bookly
          </Text>

          <Stack gap={6}>
            <Title order={1}>No encontramos esta pagina</Title>
            <Text c="dimmed">
              La ruta que intentaste abrir no existe o ya no esta disponible.
            </Text>
          </Stack>

          <Group>
            <Button component={Link} to={PATHS.public.home} color="brand">
              Ir al inicio
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
