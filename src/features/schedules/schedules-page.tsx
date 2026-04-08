import { Page } from 'shared/layout';
import { SchedulesPageContainer } from './container';

export function SchedulesPage() {
  return (
    <Page
      title="Horarios"
      description="Define los dias y franjas horarias en los que tu servicio estara disponible para reservas."
    >
      <SchedulesPageContainer />
    </Page>
  );
}
