import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Button, Text } from '@mantine/core';
import { PATHS } from 'app/router';
import { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import classes from './auth-success-state.module.css';

interface AuthSuccessStateProps {
  title?: string;
  description: string;
  noticeTitle: string;
  noticeText: string;
  loginMessage: string;
  redirectDelayMs?: number;
}

export function AuthSuccessState({
  title = 'Listo!',
  description,
  noticeTitle,
  noticeText,
  loginMessage,
  redirectDelayMs = 3000,
}: AuthSuccessStateProps) {
  const navigate = useNavigate();

  const goToLogin = useCallback(() => {
    navigate(PATHS.auth.login, {
      replace: true,
      state: {
        message: loginMessage,
        emailSent: true,
      },
    });
  }, [loginMessage, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(goToLogin, redirectDelayMs);

    return () => window.clearTimeout(timer);
  }, [goToLogin, redirectDelayMs]);

  return (
    <section className={classes.root} aria-live="polite">
      <div className={classes.iconWrap} aria-hidden="true">
        <FontAwesomeIcon icon={faCheck} className={classes.icon} />
      </div>

      <div className={classes.copy}>
        <Text component="h1" className={classes.title}>
          {title}
        </Text>

        <Text className={classes.description}>{description}</Text>
      </div>

      <div className={classes.notice}>
        <span className={classes.noticeIcon} aria-hidden="true">
          <FontAwesomeIcon icon={faCheck} />
        </span>

        <div>
          <Text component="p" size="sm" className={classes.noticeTitle}>
            {noticeTitle}
          </Text>

          <Text component="p" size="sm" className={classes.noticeText}>
            {noticeText}
          </Text>
        </div>
      </div>

      <div className={classes.actions}>
        <Button onClick={goToLogin} fullWidth>
          Ir al inicio de sesion
        </Button>

        <Anchor
          component={Link}
          to={PATHS.public.home}
          underline="never"
          className={classes.secondaryLink}
        >
          Volver al inicio
        </Anchor>
      </div>
    </section>
  );
}
