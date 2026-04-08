import { PATHS } from 'app/router/PATHS';
import { generatePath } from 'react-router-dom';

const getWindowOrigin = () => (typeof window !== 'undefined' ? window.location.origin : undefined);

export const buildPublicBookingPath = (slug: string, token: string) =>
  generatePath(PATHS.public.booking, { slug, token });

export const buildPublicBookingUrl = (
  slug: string,
  token: string,
  origin = getWindowOrigin(),
) => {
  const publicPath = buildPublicBookingPath(slug, token);

  if (!origin) {
    return publicPath;
  }

  return new URL(publicPath, origin).toString();
};
