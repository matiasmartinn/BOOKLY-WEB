import { Page } from 'shared/layout';
import { TeamPageContainer } from './container';

export function TeamPage() {
  return (
    <Page title="Equipo" description="Gestiona el equipo de secretarios/as del negocio.">
      <TeamPageContainer />
    </Page>
  );
}
