import { Page } from 'shared/layout';

import { HistoryPageContainer } from './container';

export function HistoryPage() {
  return (
    <Page title="Historico" description="Consulta Historica de turnos del negocio.">
      <HistoryPageContainer />
    </Page>
  );
}
