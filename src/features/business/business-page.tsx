import { Page } from 'shared/layout';
import { BusinessPageContainer } from './container';

export function BusinessPage() {
  return (
    <Page title="Mi servicio" description="Edita los datos base del servicio actual.">
      <BusinessPageContainer />
    </Page>
  );
}
