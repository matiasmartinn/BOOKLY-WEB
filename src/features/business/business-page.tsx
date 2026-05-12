import { PATHS } from 'app/router';
import { useNavigate } from 'react-router';
import { Page } from 'shared/layout';
import { Button, Group } from '@mantine/core';
import { useBusinessStore } from 'store/use-business-store';

import { BusinessPageContainer } from './container';

export function BusinessPage() {
  const navigate = useNavigate();
  const selectedService = useBusinessStore((state) => state.selectedService);
  return (
    <Page
      title="Mi servicio"
      description="Edita los datos del servicio actual."
      actions={
        <Group justify="flex-end">
          <Button
            variant="light"
            color="brand"
            disabled={!selectedService}
            onClick={() => {
              if (!selectedService) return;

              navigate(
                PATHS.dashboard.servicePublicBooking.replace(
                  ':serviceId',
                  String(selectedService.id),
                ),
              );
            }}
          >
            Gestionar reserva pública
          </Button>
        </Group>
      }
    >
      <BusinessPageContainer />
    </Page>
  );
}
