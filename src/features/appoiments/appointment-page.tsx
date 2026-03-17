import { Button } from '@mantine/core';
import { PageCard, PageShell } from 'shared/layout';
import { AppointmentTable } from './components/appointment-table';

export function AppointmentPage() {
  const openModal = () => {
    console.log('Modal con el form de turno');
  };

  return (
    <PageShell
      title="Turnos"
      description="Listado de turnos del servicio seleccionado."
      actions={<Button onClick={openModal}>Agregar Turno</Button>}
    >
      <PageCard>
        <AppointmentTable />
      </PageCard>
    </PageShell>
  );
}
