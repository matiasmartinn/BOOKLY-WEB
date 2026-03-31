import { useState } from 'react';
import { Alert, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useOwnerSecretaries } from 'features/users/hooks';
import { GenericModal } from 'shared/components';
import { PageCard, PageShell } from 'shared/layout';
import type { BusinessDto, SecretaryDto } from 'shared/models';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';
import {
  CreateSecretaryForm,
  EditSecretaryProfileForm,
  SecretaryPermissionsForm,
  SecretaryStatusForm,
  TeamTable,
} from './components';

export function TeamPage() {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const selectService = useBusinessStore((s) => s.selectService);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedSecretary, setSelectedSecretary] = useState<SecretaryDto | null>(null);

  const [createOpened, createHandlers] = useDisclosure(false);
  const [profileOpened, profileHandlers] = useDisclosure(false);
  const [permissionsOpened, permissionsHandlers] = useDisclosure(false);
  const [statusOpened, statusHandlers] = useDisclosure(false);

  const { data = [], isLoading, isFetching, isError, refetch } = useOwnerSecretaries(authUser?.id);

  const clearSelection = () => setSelectedSecretary(null);

  const syncSelectedService = async () => {
    if (selectedService) {
      await selectService(selectedService.id);
    }
  };

  const handleCreateSuccess = async () => {
    createHandlers.close();
    setSuccessMessage('Secretario/a creado correctamente.');
    await syncSelectedService();
  };

  const handleProfileSuccess = () => {
    profileHandlers.close();
    clearSelection();
    setSuccessMessage('Perfil actualizado correctamente.');
  };

  const handlePermissionsSuccess = () => {
    permissionsHandlers.close();
    clearSelection();
    setSuccessMessage('Permisos del servicio actualizados correctamente.');
  };

  const handleStatusSuccess = () => {
    statusHandlers.close();
    clearSelection();
    setSuccessMessage('Estado del secretario/a actualizado correctamente.');
  };

  const handleServiceUpdated = (_service: BusinessDto) => {
    void refetch();
  };

  const openProfile = (secretary: SecretaryDto) => {
    setSuccessMessage(null);
    setSelectedSecretary(secretary);
    profileHandlers.open();
  };

  const openPermissions = (secretary: SecretaryDto) => {
    if (!selectedService) return;

    setSuccessMessage(null);
    setSelectedSecretary(secretary);
    permissionsHandlers.open();
  };

  const openStatus = (secretary: SecretaryDto) => {
    setSuccessMessage(null);
    setSelectedSecretary(secretary);
    statusHandlers.open();
  };

  const closeProfile = () => {
    profileHandlers.close();
    clearSelection();
  };

  const closePermissions = () => {
    permissionsHandlers.close();
    clearSelection();
  };

  const closeStatus = () => {
    statusHandlers.close();
    clearSelection();
  };

  return (
    <>
      <PageShell title="Equipo" description="Gestiona el equipo de secretarios/as del negocio.">
        <Stack gap="md">
          {!selectedService && (
            <Alert color="yellow" variant="light">
              Gestion del equipo sobre el servicio seleccionado.
            </Alert>
          )}

          {successMessage && (
            <Alert color="green" variant="light">
              {successMessage}
            </Alert>
          )}

          <PageCard>
            <TeamTable
              secretaries={data}
              selectedServiceId={selectedService?.id}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              onRefetch={() => {
                void refetch();
              }}
              onCreate={() => {
                setSuccessMessage(null);
                createHandlers.open();
              }}
              onEditProfile={openProfile}
              onManagePermissions={openPermissions}
              onManageStatus={openStatus}
              canCreate={Boolean(authUser && selectedService)}
            />
          </PageCard>
        </Stack>
      </PageShell>

      <GenericModal
        opened={createOpened}
        onClose={createHandlers.close}
        title="Agregar secretario/a"
        size="lg"
      >
        {createOpened && authUser && selectedService ? (
          <CreateSecretaryForm
            ownerId={authUser.id}
            serviceId={selectedService.id}
            serviceName={selectedService.name}
            onCancel={createHandlers.close}
            onSuccess={() => {
              void handleCreateSuccess();
            }}
          />
        ) : null}
      </GenericModal>

      <GenericModal opened={profileOpened} onClose={closeProfile} title="Perfil" size="lg">
        {profileOpened && selectedSecretary ? (
          <EditSecretaryProfileForm
            secretaryId={selectedSecretary.id}
            onCancel={closeProfile}
            onSuccess={handleProfileSuccess}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={permissionsOpened}
        onClose={closePermissions}
        title="Permisos"
        size="lg"
      >
        {permissionsOpened && selectedSecretary && selectedService && authUser ? (
          <SecretaryPermissionsForm
            ownerId={authUser.id}
            secretary={selectedSecretary}
            selectedService={selectedService}
            onCancel={closePermissions}
            onSuccess={handlePermissionsSuccess}
            onServiceUpdated={handleServiceUpdated}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={statusOpened}
        onClose={closeStatus}
        title={selectedSecretary?.isActive ? 'Dar de baja' : 'Reactivar'}
        size="md"
      >
        {statusOpened && selectedSecretary ? (
          <SecretaryStatusForm
            secretary={selectedSecretary}
            onCancel={closeStatus}
            onSuccess={handleStatusSuccess}
          />
        ) : null}
      </GenericModal>
    </>
  );
}
