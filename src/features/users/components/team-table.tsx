import { faBan, faCheck, faLock, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { GenericTable } from 'shared/components';
import type { SecretaryDto } from 'shared/models';

import { teamColumns } from '../defaults';

interface TeamTableProps {
  secretaries: SecretaryDto[];
  selectedServiceId?: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onCreate: () => void;
  onEditProfile: (secretary: SecretaryDto) => void;
  onManagePermissions: (secretary: SecretaryDto) => void;
  onManageStatus: (secretary: SecretaryDto) => void;
  canCreate: boolean;
  canManagePermissions: boolean;
}

export function TeamTable({
  secretaries,
  selectedServiceId,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onCreate,
  onEditProfile,
  onManagePermissions,
  onManageStatus,
  canCreate,
  canManagePermissions,
}: TeamTableProps) {
  return (
    <GenericTable
      data={secretaries}
      columns={teamColumns(selectedServiceId)}
      rowKey="id"
      loading={isLoading}
      fetching={isFetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el equipo del negocio."
      showSearch
      showPaginator
      pageSize={10}
      minWidth={980}
      emptyMessage="Todavía no invitaste secretarios. Agregá uno para delegar la gestión de turnos."
      searchPlaceholder="Buscar por nombre o email"
      searchFn={(row, query) => {
        const value = query.toLowerCase();
        return (
          row.fullName.toLowerCase().includes(value) || row.email.toLowerCase().includes(value)
        );
      }}
      customButtons={
        <Tooltip
          label={
            canCreate
              ? 'Agregar secretario/a'
              : 'Selecciona un servicio para dar de alta un secretario/a'
          }
          withArrow
        >
          <div>
            <Button
              color="brand"
              onClick={onCreate}
              disabled={!canCreate}
              leftSection={<FontAwesomeIcon icon={faPlus} />}
            >
              Agregar secretario/a
            </Button>
          </div>
        </Tooltip>
      }
      columnOfActions={{
        width: 180,
        textAlign: 'center',
        render: (row) => (
          <Group justify="center" gap="xs">
            <Tooltip label="Perfil" withArrow>
              <ActionIcon
                variant="subtle"
                color="brand"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditProfile(row);
                }}
              >
                <FontAwesomeIcon icon={faUser} />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label={
                canManagePermissions
                  ? 'Gestionar permisos por servicio'
                  : 'Necesitas al menos un servicio para gestionar permisos'
              }
              withArrow
            >
              <div>
                <ActionIcon
                  variant="subtle"
                  color="brand"
                  onClick={(event) => {
                    event.stopPropagation();
                    onManagePermissions(row);
                  }}
                  disabled={!canManagePermissions}
                >
                  <FontAwesomeIcon icon={faLock} />
                </ActionIcon>
              </div>
            </Tooltip>

            <Tooltip label={row.isActive ? 'Dar de baja' : 'Reactivar'} withArrow>
              <ActionIcon
                variant="subtle"
                color={row.isActive ? 'red' : 'green'}
                onClick={(event) => {
                  event.stopPropagation();
                  onManageStatus(row);
                }}
              >
                <FontAwesomeIcon icon={row.isActive ? faBan : faCheck} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      }}
    />
  );
}
