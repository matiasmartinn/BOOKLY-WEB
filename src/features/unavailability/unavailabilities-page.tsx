import { Page } from 'shared/layout';

import { UnavailabilitiesPageContainer } from './container';

export function UnavailabilitiesPage() {
  return (
    <Page
      title="Excepciones"
      description="Bloqueos, vacaciones e indisponibilidades que modifican la operacion base del servicio."
    >
      <UnavailabilitiesPageContainer />
    </Page>
  );
}
