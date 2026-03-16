import { Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from 'store/use-buisness-store';
import { useAuthStore } from 'store/use-auth-store';
import { PATHS } from 'app/router/PATHS';
import { BusinessWizard } from './components/business-wizard';

/**
 * Página completa para el wizard de creación de servicio.
 * Sin sidebar, sin AppShell — experiencia enfocada.
 * Montada en /service/new dentro de AppLayout (solo provee el QueryClient
 * y el MantineProvider, nada visual).
 */
export function BusinessWizardPage() {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const loadServices = useBusinessStore((s) => s.loadServices);

  const handleComplete = async () => {
    // Recarga la lista de servicios para que el switcher
    // muestre el recién creado sin necesidad de re-login.
    if (authUser) {
      await loadServices(authUser.id);
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
      <BusinessWizard onComplete={handleComplete} onCancel={handleCancel} />
    </Box>
  );
}
