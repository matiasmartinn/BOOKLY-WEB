import { SimpleGrid, Textarea, TextInput } from '@mantine/core';
import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface ClientDataFieldValues {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientNotes?: string;
}

interface ClientDataFieldsProps<TFieldValues extends FieldValues = FieldValues> {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  disabled?: boolean;
  nameLabel?: string;
  notesPlaceholder?: string;
}

export function ClientDataFields<TFieldValues extends FieldValues = FieldValues>({
  register,
  errors,
  disabled = false,
  nameLabel = 'Cliente',
  notesPlaceholder = 'Observaciones del cliente',
}: ClientDataFieldsProps<TFieldValues>) {
  const clientErrors = errors as FieldErrors<ClientDataFieldValues>;

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          label={nameLabel}
          placeholder="Juan Perez"
          withAsterisk
          {...register('clientName' as Path<TFieldValues>)}
          error={clientErrors.clientName?.message}
          disabled={disabled}
        />

        <TextInput
          label="Telefono"
          placeholder="3364..."
          withAsterisk
          {...register('clientPhone' as Path<TFieldValues>)}
          error={clientErrors.clientPhone?.message}
          disabled={disabled}
        />
      </SimpleGrid>

      <TextInput
        label="Email"
        placeholder="cliente@correo.com"
        withAsterisk
        {...register('clientEmail' as Path<TFieldValues>)}
        error={clientErrors.clientEmail?.message}
        disabled={disabled}
      />

      <Textarea
        label="Notas"
        placeholder={notesPlaceholder}
        minRows={3}
        autosize
        {...register('clientNotes' as Path<TFieldValues>)}
        error={clientErrors.clientNotes?.message}
        disabled={disabled}
      />
    </>
  );
}
