import { Page } from 'shared/layout';

import { BusinessPublicBookingPageContainer } from './container';

export function BusinessPublicBookingPage() {
  return (
    <Page
      title="Public Booking"
      description="Gestiona el enlace publico y el estado de la reserva online del servicio."
    >
      <BusinessPublicBookingPageContainer />
    </Page>
  );
}
