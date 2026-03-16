import { Button } from '@mantine/core';
import { PageCard, PageShell } from 'shared/layout';
import { UnavailabilityTable } from './unavailability-table';

export function UnavailabilitiesPage() {
  const openModal = () => {
    console.log('Modal con el form de fechas');
  };

  return (
    <PageShell
      title="Fechas inhabilitidas"
      description="Fechas especificas en las que no se admitiran reservas de turnos."
      actions={<Button onClick={openModal}>Deshabilitar Fecha</Button>}
    >
      <PageCard>
        <UnavailabilityTable serviceId={1} />
      </PageCard>
    </PageShell>
  );
}
