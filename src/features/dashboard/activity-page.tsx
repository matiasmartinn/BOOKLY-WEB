import { Page } from 'shared/layout';

import { ActivityPageContainer } from './container';

export function EventsPage() {
  return (
    <Page
      title="Auditoría"
      description="Listado de eventos de creacion y cambios de estado de turnos."
    >
      <ActivityPageContainer />
    </Page>
  );
}
