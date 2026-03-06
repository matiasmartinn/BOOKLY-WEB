import { Button } from '@mantine/core';
import { SchedulesForm } from 'features/schedules/components/schedules-form';
import { PageCard, PageShell } from 'shared/layout';

export function SchedulesPage() {
  const handleSave = () => {
    // después lo conectás con submit real
    console.log('Guardar horarios');
  };

  return (
    <PageShell
      title="Horarios"
      description="Definí los días y franjas horarias en los que tu servicio estará disponible para reservas."
      actions={<Button onClick={handleSave}>Guardar cambios</Button>}
    >
      <PageCard>
        <SchedulesForm />
      </PageCard>
    </PageShell>
  );
}
