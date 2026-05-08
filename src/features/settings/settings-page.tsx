import { Page } from 'shared/layout';

import { SettingsPageContainer } from './container';

export function SettingsPage() {
  return (
    <Page
      title="Cuenta"
      description="Administra tu informacion personal."
      contentMaxWidth={980}
    >
      <SettingsPageContainer />
    </Page>
  );
}
