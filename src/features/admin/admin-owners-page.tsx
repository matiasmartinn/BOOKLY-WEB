import { Page } from 'shared/layout';
import { AdminOwnersPageContainer } from './container';

export function AdminOwnersPage() {
  return (
    <Page
      title="Owners"
      description="Gestion administrativa de cuentas owner con filtros reales y acciones de habilitacion."
    >
      <AdminOwnersPageContainer />
    </Page>
  );
}
