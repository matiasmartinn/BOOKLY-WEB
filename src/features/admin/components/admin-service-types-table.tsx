import { faBan, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { GenericTable } from 'shared/components';
import type { ServiceTypeDto } from 'shared/models';

import { adminServiceTypeColumns } from '../defaults';

interface AdminServiceTypesTableProps {
  serviceTypes: ServiceTypeDto[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onCreate: () => void;
  onEdit: (serviceType: ServiceTypeDto) => void;
  onDisable: (serviceType: ServiceTypeDto) => void;
}

export function AdminServiceTypesTable({
  serviceTypes,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onCreate,
  onEdit,
  onDisable,
}: AdminServiceTypesTableProps) {
  return (
    <GenericTable
      data={serviceTypes}
      columns={adminServiceTypeColumns}
      rowKey="id"
      loading={isLoading}
      fetching={isFetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el listado de tipos de servicio."
      showSearch
      showPaginator
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      minWidth={920}
      emptyMessage="Todavia no hay tipos de servicio registrados."
      searchPlaceholder="Buscar por nombre o descripcion"
      searchFn={(row, query) => {
        const value = query.toLowerCase();

        return (
          row.name.toLowerCase().includes(value) ||
          (row.description?.toLowerCase().includes(value) ?? false)
        );
      }}
      customButtons={
        <Button
          color="brand"
          onClick={onCreate}
          leftSection={<FontAwesomeIcon icon={faPlus} />}
        >
          Nuevo tipo de servicio
        </Button>
      }
      columnOfActions={{
        header: 'Acciones',
        width: 120,
        textAlign: 'center',
        render: (row) => (
          <Group justify="center" gap="xs">
            <Tooltip label="Editar" withArrow>
              <ActionIcon
                variant="subtle"
                color="brand"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(row);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label={row.isActive ? 'Deshabilitar tipo de servicio' : 'Tipo de servicio deshabilitado'}
              withArrow
            >
              <div>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDisable(row);
                  }}
                  disabled={!row.isActive}
                >
                  <FontAwesomeIcon icon={faBan} />
                </ActionIcon>
              </div>
            </Tooltip>
          </Group>
        ),
      }}
    />
  );
}
