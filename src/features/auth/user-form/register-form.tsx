import {
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Paper,
  Anchor,
} from '@mantine/core';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormFields } from './schema';
import { AuthCard } from 'shared/ui';
import { PATHS } from 'app/router';
import { Link } from 'react-router-dom';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormFields>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<UserFormFields> = (data) => {
    console.log(data);
  };

  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap={3} align="center">
          <Title order={3}>Crear usuario</Title>
          <Text>Completa los datos para poder crear su cuenta.</Text>
        </Stack>
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Juan"
            withAsterisk
            {...register('firstName')}
            error={errors.firstName?.message}
          />

          <TextInput
            label="Apellido"
            placeholder="Pérez"
            withAsterisk
            {...register('lastName')}
            error={errors.lastName?.message}
          />

          <TextInput
            label="Email"
            placeholder="usuario@correo.com"
            withAsterisk
            {...register('email')}
            error={errors.email?.message}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="********"
            withAsterisk
            {...register('password')}
            error={errors.password?.message}
          />

          <Stack gap="xs" align="center">
            <Button type="submit">Ingresar</Button>
            <Text size="sm" c="dimmed" ta="center">
              ¿Ya tenes una cuenta?{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.login}>
                Ingresa
              </Anchor>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </AuthCard>
  );
}
