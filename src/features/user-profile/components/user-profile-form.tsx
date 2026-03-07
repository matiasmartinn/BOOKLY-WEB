import { Fieldset, Group, Paper, TextInput } from '@mantine/core';

export function UserProfileForm() {
  const onSubmit = () => {};
  return (
    <Paper component="form" onSubmit={onSubmit} withBorder={false}>
      <Group gap="sm">
        <Fieldset legend="Personal information">
          <Group gap="sm">
            <TextInput label="Nombre" placeholder="Nombre" />
            <TextInput label="Apellido" placeholder="Apellido" />
          </Group>
          <TextInput label="Email" placeholder="Email" mt="md" />
        </Fieldset>
      </Group>
    </Paper>
  );
}
