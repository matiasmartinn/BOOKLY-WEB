import { Box, Stack, Text } from '@mantine/core';

import classes from './auth-shell.module.css';

interface AuthBrandProps {
  light?: boolean;
  compact?: boolean;
}

export function AuthBrand({ light = false, compact = false }: AuthBrandProps) {
  const markClass = light
    ? `${classes.brandMark} ${classes.brandMarkLight}`
    : classes.brandMark;
  const nameClass = light ? `${classes.brandName} ${classes.brandNameLight}` : classes.brandName;
  const captionClass = light
    ? `${classes.brandCaption} ${classes.brandCaptionLight}`
    : classes.brandCaption;

  return (
    <div className={classes.brandRoot}>
      <Box className={markClass}>B</Box>

      <Stack gap={0}>
        <Text className={nameClass}>Bookly</Text>

        {!compact ? <Text className={captionClass}>Agenda profesional con foco operativo</Text> : null}
      </Stack>
    </div>
  );
}
