import { Page } from 'shared/layout';

import { OverviewPageContainer } from './container';

export function OverviewPage() {
  return (
    <Page
      title="Resumen"
      description="Panel rapido del servicio actual para entender que pasa hoy y navegar al flujo correcto."
    >
      <OverviewPageContainer />
    </Page>
  );
}
