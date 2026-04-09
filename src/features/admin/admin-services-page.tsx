import { Page } from 'shared/layout';

import { AdminServicesPageContainer } from './container';

export function AdminServicesPage() {
  return (
    <Page
      title="Servicios"
      description="Gestion administrativa de negocios y servicios con filtros operativos y cambio de estado."
    >
      <AdminServicesPageContainer />
    </Page>
  );
}
