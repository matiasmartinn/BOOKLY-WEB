import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { AuthViewContent } from './auth-shell-content';
import { AuthBrand } from './auth-brand';
import classes from './auth-shell.module.css';

interface AuthAsideProps {
  content: AuthViewContent;
}

type AsidePhase = 'entered' | 'exiting' | 'hidden' | 'entering';

const EXIT_DURATION_MS = 180;
const SWAP_DELAY_MS = 130;
const ENTER_DURATION_MS = 260;

export function AuthAside({ content }: AuthAsideProps) {
  const [displayedContent, setDisplayedContent] = useState(content);
  const [phase, setPhase] = useState<AsidePhase>('entered');

  useEffect(() => {
    if (content.id === displayedContent.id) {
      setPhase('entered');
      return;
    }

    setPhase('exiting');

    const hideTimer = window.setTimeout(() => {
      setPhase('hidden');
    }, EXIT_DURATION_MS);

    const swapTimer = window.setTimeout(() => {
      setDisplayedContent(content);
    }, EXIT_DURATION_MS + SWAP_DELAY_MS);

    const enterTimer = window.setTimeout(
      () => {
        setPhase('entering');
      },
      EXIT_DURATION_MS + SWAP_DELAY_MS + 16,
    );

    const settleTimer = window.setTimeout(
      () => {
        setPhase('entered');
      },
      EXIT_DURATION_MS + SWAP_DELAY_MS + ENTER_DURATION_MS + 16,
    );

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(swapTimer);
      window.clearTimeout(enterTimer);
      window.clearTimeout(settleTimer);
    };
  }, [content.id]);

  const headlineClassName = [
    classes.asideHeadline,
    phase === 'entered' && classes.asideHeadlineEntered,
    phase === 'entering' && classes.asideHeadlineEntering,
    phase === 'exiting' && classes.asideHeadlineExiting,
    phase === 'hidden' && classes.asideHeadlineHidden,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={classes.aside}>
      <div className={classes.asideTop}>
        <AuthBrand />
      </div>

      <div className={classes.asideNarrative}>
        <div className={classes.asideHeadlineFrame}>
          <div className={headlineClassName}>
            {displayedContent.asideLines.map((line) => (
              <Text
                key={line}
                component="p"
                className={classes.asideHeadlineLine}
                fz="clamp(2.4rem, 3.2vw + 1rem, 3.6rem)"
                lh={0.84}
              >
                {line}
              </Text>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
