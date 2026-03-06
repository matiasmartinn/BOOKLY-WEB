import { Button } from '@mantine/core';
import { PageCard, PageShell } from 'shared/layout';
import { UserProfileForm } from './components';

export function UserProfilePage() {
  const handleSave = () => {
    // después lo conectás con submit real
    console.log('Guardar horarios');
  };

  return (
    <PageShell
      title="Perfil"
      description="Completa o actualiza tu perfil."
      actions={<Button onClick={handleSave}>Guardar cambios</Button>}
    >
      <PageCard>
        <UserProfileForm />
      </PageCard>
    </PageShell>
  );
}
