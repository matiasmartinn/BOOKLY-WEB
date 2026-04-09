import { Page } from 'shared/layout';

import { MetricsPageContainer } from './container';

export function MetricsPage() {
  return (
    <Page
      title="Metricas"
      description="Vista analitica del negocio para entender volumen, asistencia y demanda del periodo seleccionado."
    >
      <MetricsPageContainer />
    </Page>
  );
}
