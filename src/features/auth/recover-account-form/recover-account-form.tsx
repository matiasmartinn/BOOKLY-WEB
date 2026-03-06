import { Stack, TextInput, Title, Text, Button } from '@mantine/core';
import { AuthCard } from 'shared/ui/components';

export function RecoverAccountForm() {
  return (
    <AuthCard onSubmit={() => {}}>
      <Stack gap="md">
        <Title order={3}>Olvidé mi contraseña</Title>
        <Text>Ingresa el Email de tu cuenta para recuperar la contraseña </Text>
        <TextInput label="Email" placeholder="Email" />
        <Button type="submit">Recuperar</Button>
      </Stack>
    </AuthCard>
  );
}
