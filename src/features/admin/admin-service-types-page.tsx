import { Page } from 'shared/layout';

import { AdminServiceTypesPageContainer } from './container';

export function AdminServiceTypesPage() {
  return (
    <Page
      title="Tipos de servicio"
      description="Gestion administrativa de tipos de servicio con acciones de alta, edicion y deshabilitacion."
    >
      <AdminServiceTypesPageContainer />
    </Page>
  );
}
