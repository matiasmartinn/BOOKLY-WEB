import { Page } from 'shared/layout';

import { AppointmentPageContainer } from './container/appointment-page-container';

export function AppointmentPage() {
  return (
    <Page
      title="Turnos"
      description="Operacion diaria del servicio seleccionado, centrada en el dia y en acciones rapidas sobre cada turno."
    >
      <AppointmentPageContainer />
    </Page>
  );
}
