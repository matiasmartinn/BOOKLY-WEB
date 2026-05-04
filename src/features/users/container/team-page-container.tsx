import { Alert, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useOwnerSecretaries } from 'features/users/hooks';
import { useState } from 'react';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';
import type { BusinessDto, SecretaryDto, UserEmailDispatchResultDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

import {
  CreateSecretaryForm,
  EditSecretaryProfileForm,
  SecretaryPermissionsForm,
  SecretaryStatusForm,
  TeamTable,
} from '../components';

export function TeamPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const services = useBusinessStore((s) => s.services);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const selectService = useBusinessStore((s) => s.selectService);

  const [selectedSecretary, setSelectedSecretary] = useState<SecretaryDto | null>(null);
  const toast = useAppToast();

  const [createOpened, createHandlers] = useDisclosure(false);
  const [profileOpened, profileHandlers] = useDisclosure(false);
  const [permissionsOpened, permissionsHandlers] = useDisclosure(false);
  const [statusOpened, statusHandlers] = useDisclosure(false);

  const { data = [], isLoading, isFetching, isError, refetch } = useOwnerSecretaries(authUser?.id);
  const initialPermissionServiceId = selectedService?.id ?? services[0]?.id;

  const clearSelection = () => setSelectedSecretary(null);

  const syncSelectedService = async () => {
    if (selectedService) {
      await selectService(selectedService.id);
    }
  };

  const handleCreateSuccess = async (result: UserEmailDispatchResultDto) => {
    createHandlers.close();
    if (result.emailDispatch.emailSent) {
      toast.success(result.emailDispatch.message);
    } else {
      toast.error(result.emailDispatch.message, {
        title: 'Secretario/a creado con advertencia',
      });
    }
    await syncSelectedService();
  };

  const handleProfileSuccess = () => {
    profileHandlers.close();
    clearSelection();
    toast.success('Perfil actualizado correctamente.');
  };

  const handlePermissionsSuccess = () => {
    permissionsHandlers.close();
    clearSelection();
    toast.success('Permisos del servicio actualizados correctamente.');
  };

  const handleStatusSuccess = () => {
    statusHandlers.close();
    clearSelection();
    toast.success('Estado del secretario/a actualizado correctamente.');
  };

  const handleServiceUpdated = (_service: BusinessDto) => {
    void refetch();
  };

  const openProfile = (secretary: SecretaryDto) => {
    setSelectedSecretary(secretary);
    profileHandlers.open();
  };

  const openPermissions = (secretary: SecretaryDto) => {
    if (services.length === 0) return;

    setSelectedSecretary(secretary);
    permissionsHandlers.open();
  };

  const openStatus = (secretary: SecretaryDto) => {
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
      <Stack gap="md">
        {!selectedService && (
          <Alert color="yellow" variant="light">
            Puedes gestionar permisos por servicio desde el modal. Para crear un secretario/a,
            primero debes seleccionar un servicio en el sidebar.
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
              createHandlers.open();
            }}
            onEditProfile={openProfile}
            onManagePermissions={openPermissions}
            onManageStatus={openStatus}
            canCreate={Boolean(authUser && selectedService)}
            canManagePermissions={services.length > 0}
          />
        </PageCard>
      </Stack>

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
            onCancel={createHandlers.close}
            onSuccess={(result) => {
              void handleCreateSuccess(result);
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
        {permissionsOpened && selectedSecretary && authUser && services.length > 0 ? (
          <SecretaryPermissionsForm
            ownerId={authUser.id}
            secretary={selectedSecretary}
            services={services}
            initialServiceId={initialPermissionServiceId}
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
