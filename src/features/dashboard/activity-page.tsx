import { Page } from 'shared/layout';
import { ActivityPageContainer } from './container';

export function EventsPage() {
  return (
    <Page title="Actividad" description="Auditoria de creacion y cambios de estado de turnos.">
      <ActivityPageContainer />
    </Page>
  );
}
