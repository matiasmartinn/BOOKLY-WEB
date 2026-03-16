import { Title, Text, TextInput, PasswordInput, Button, Stack, Anchor } from '@mantine/core';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from 'shared/ui/components';
import { PATHS } from 'app/router';
import { Link } from 'react-router-dom';
import { useRegister } from '../auth.hooks';
import { registerUserSchema, type RegisterUserRequst } from './register-user.schema';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserRequst>({
    resolver: zodResolver(registerUserSchema),
  });

  const { mutate, isPending } = useRegister();

  const onSubmit: SubmitHandler<RegisterUserRequst> = ({ confirmPassword, ...dto }) => {
    mutate(dto);
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

          <PasswordInput
            label="Confirme Contraseña"
            placeholder="********"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
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
