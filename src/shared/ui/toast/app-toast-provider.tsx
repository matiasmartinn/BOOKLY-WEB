import {
  Box,
  CloseButton,
  Group,
  Paper,
  Portal,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { appColorVars } from 'shared/ui/theme/theme';

type AppToastTone = 'success' | 'error';

interface AppToastInput {
  message: string;
  tone: AppToastTone;
  title?: string;
  autoClose?: number;
}

interface AppToast extends AppToastInput {
  id: string;
}

interface AppToastContextValue {
  showToast: (toast: AppToastInput) => void;
  success: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
  error: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
}

interface AppToastProviderProps {
  children: ReactNode;
}

const DEFAULT_AUTO_CLOSE = 4000;
const TOAST_ENTER_DURATION = 220;
const TOAST_EXIT_DURATION = 160;

const AppToastContext = createContext<AppToastContextValue | null>(null);

const DEFAULT_TITLES: Record<AppToastTone, string> = {
  success: 'Operacion completada',
  error: 'No se pudo completar la operacion',
};

function AppToastItem({
  toast,
  onClose,
}: {
  toast: AppToast;
  onClose: (id: string) => void;
}) {
  const theme = useMantineTheme();
  const [isVisible, setIsVisible] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    setIsVisible(false);
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose(toast.id);
    }, TOAST_EXIT_DURATION);
  }, [onClose, toast.id]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      handleClose();
    }, toast.autoClose ?? DEFAULT_AUTO_CLOSE);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [handleClose, toast.autoClose]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  const accentColor =
    toast.tone === 'success' ? theme.colors.success[6] : theme.colors.error[6];
  const accentSoft =
    toast.tone === 'success' ? theme.colors.success[0] : theme.colors.error[0];

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      role={toast.tone === 'error' ? 'alert' : 'status'}
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: appColorVars.surface,
        backgroundImage: `linear-gradient(135deg, ${accentSoft} 0%, transparent 42%)`,
        borderColor: appColorVars.border,
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: appColorVars.shadowFloating,
        backdropFilter: 'blur(14px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
        transition: [
          `opacity ${TOAST_EXIT_DURATION}ms ease`,
          `transform ${TOAST_ENTER_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        ].join(', '),
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 1,
          background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />

      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <Group align="flex-start" wrap="nowrap" gap="sm" style={{ flex: 1 }}>
          <Box
            mt={4}
            style={{
              width: 10,
              height: 10,
              borderRadius: '999px',
              flexShrink: 0,
              backgroundColor: accentColor,
              boxShadow: `0 0 0 6px ${accentSoft}`,
            }}
          />

          <Stack gap={4} style={{ flex: 1 }}>
            <Text
              size="xs"
              fw={700}
              style={{ letterSpacing: '0.04em', textTransform: 'uppercase', color: accentColor }}
            >
              {toast.title ?? DEFAULT_TITLES[toast.tone]}
            </Text>

            <Text size="sm" style={{ color: appColorVars.textPrimary, lineHeight: 1.45 }}>
              {toast.message}
            </Text>
          </Stack>
        </Group>

        <CloseButton
          size="sm"
          onClick={handleClose}
          aria-label="Cerrar notificacion"
          style={{
            borderRadius: '999px',
            border: `1px solid ${appColorVars.border}`,
            backgroundColor: appColorVars.surfaceSoft,
            color: appColorVars.textMuted,
          }}
        />
      </Group>
    </Paper>
  );
}

export function AppToastProvider({ children }: AppToastProviderProps) {
  const [toasts, setToasts] = useState<AppToast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: AppToastInput) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const value = useMemo<AppToastContextValue>(
    () => ({
      showToast,
      success: (message, options) => showToast({ ...options, message, tone: 'success' }),
      error: (message, options) => showToast({ ...options, message, tone: 'error' }),
    }),
    [showToast],
  );

  return (
    <AppToastContext.Provider value={value}>
      {children}

      <Portal>
        <Box
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 400,
            width: 'min(380px, calc(100vw - 32px))',
            pointerEvents: 'none',
          }}
        >
          <Stack gap="sm">
            {toasts.map((toast) => (
              <AppToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
          </Stack>
        </Box>
      </Portal>
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(AppToastContext);

  if (!context) {
    throw new Error('useAppToast debe usarse dentro de AppToastProvider.');
  }

  return context;
}
