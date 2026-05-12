import { PATHS } from 'app/router';
import { useNavigate } from 'react-router';
import { Page } from 'shared/layout';
import { Button } from '@mantine/core';

import { BusinessPublicBookingPageContainer } from './container';
export function BusinessPublicBookingPage() {
  const navigate = useNavigate();
  return (
    <Page
      title="Reserva Pública"
      description="Gestiona el enlace publico y el estado de la reserva online del servicio."
      actions={
        <Button variant="light" color="brand" onClick={() => navigate(PATHS.dashboard.service)}>
          Volver a servicio
        </Button>
      }
    >
      <BusinessPublicBookingPageContainer />
    </Page>
  );
}
