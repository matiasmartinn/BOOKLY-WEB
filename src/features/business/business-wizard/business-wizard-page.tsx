import { Box } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { useNavigate } from 'react-router-dom';
import type { BusinessDto } from 'shared/models';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

import { BusinessWizardContainer } from './container';

export function BusinessWizardPage() {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const loadServices = useBusinessStore((s) => s.loadServices);
  const selectService = useBusinessStore((s) => s.selectService);

  const handleComplete = async (createdService: BusinessDto) => {
    // Recarga la lista de servicios para que el switcher
    // muestre el recién creado sin necesidad de re-login.
    if (authUser) {
      await loadServices(authUser);
      await selectService(createdService.id);
    }

    navigate(PATHS.dashboard.service, { replace: true });
  };

  const handleCancel = () => {
    // Si el usuario tiene servicios va al dashboard, si no al overview
    // (el sidebar ya maneja el empty state del switcher).
    navigate(PATHS.dashboard.overview, { replace: true });
  };

  return (
    <Box
      style={{
        width: '100%',
        minHeight: '100dvh',
        height: '100dvh',
        backgroundColor: 'var(--mantine-color-body)',
        display: 'flex',
      }}
    >
      <BusinessWizardContainer onComplete={handleComplete} onCancel={handleCancel} />
    </Box>
  );
}
