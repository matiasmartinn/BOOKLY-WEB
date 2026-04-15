import { Page } from 'shared/layout';

import { AdminDashboardPageContainer } from './container';

export function AdminDashboardPage() {
  return (
    <Page
      title="Resumen admin"
      description="Panel ejecutivo con indicadores clave, altas recientes y distribucion operativa de la plataforma."
    >
      <AdminDashboardPageContainer />
    </Page>
  );
}
