import { SchedulesForm } from 'features/schedules/components/schedules-form';
import { PageCard, PageShell } from 'shared/layout';

export function SchedulesPage() {
  return (
    <PageShell
      title="Horarios"
      description="Definí los días y franjas horarias en los que tu servicio estará disponible para reservas."
    >
      <PageCard>
        <SchedulesForm />
      </PageCard>
    </PageShell>
  );
}
