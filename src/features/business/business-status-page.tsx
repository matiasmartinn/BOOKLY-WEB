import { Page } from 'shared/layout';

import { BusinessStatusPageContainer } from './container';

export function BusinessStatusPage() {
  return (
    <Page title="Estado" description="Control del estado operativo del servicio.">
      <BusinessStatusPageContainer />
    </Page>
  );
}
