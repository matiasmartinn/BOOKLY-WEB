import { Button, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { AuthCard } from 'shared/ui/components';

export function SecretaryOnboardingForm() {
  return (
    <AuthCard onSubmit={() => {}}>
      <Stack gap="md">
        <Title order={3}>Ingrese su contraseña</Title>
        <Text>Cree su contraseña para poder operar en el sistema</Text>
        <PasswordInput label="Contraseña" placeholder="Ingrese su nueva contraseña" />
        <PasswordInput label="Verifique su contraseña" placeholder="Valide su contraseña" />
        <Button type="submit">Crear cuenta</Button>
      </Stack>
    </AuthCard>
  );
}
