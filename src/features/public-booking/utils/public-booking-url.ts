import { PATHS } from 'app/router/PATHS';
import { generatePath } from 'react-router-dom';

const getWindowOrigin = () => (typeof window !== 'undefined' ? window.location.origin : undefined);

export const buildPublicBookingPath = (slug: string, code: string) =>
  generatePath(PATHS.public.booking, { slug, code });

export const buildPublicBookingUrl = (
  slug: string,
  code: string,
  origin = getWindowOrigin(),
) => {
  const publicPath = buildPublicBookingPath(slug, code);

  if (!origin) {
    return publicPath;
  }

  return new URL(publicPath, origin).toString();
};
