import { Page, type PageProps } from './page';

export type PageShellProps = PageProps;

export function PageShell(props: PageShellProps) {
  return <Page {...props} />;
}
