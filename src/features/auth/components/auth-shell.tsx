import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthAside } from './auth-aside';
import { AuthContent } from './auth-content';
import { resolveAuthViewContent } from './auth-shell-content';
import classes from './auth-shell.module.css';

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  const { pathname } = useLocation();
  const content = resolveAuthViewContent(pathname);

  return (
    <div className={classes.shell}>
      <div className={classes.surface}>
        <AuthAside content={content} />
        <AuthContent>{children}</AuthContent>
      </div>
    </div>
  );
}
