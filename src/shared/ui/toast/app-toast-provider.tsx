import { Notifications, notifications } from '@mantine/notifications';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

type AppToastTone = 'success' | 'error' | 'warning' | 'info';

interface AppToastInput {
  message: string;
  tone: AppToastTone;
  title?: string;
  autoClose?: number | false;
}

interface AppToastContextValue {
  showToast: (toast: AppToastInput) => void;
  success: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
  error: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
  warning: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
  info: (message: string, options?: Omit<AppToastInput, 'message' | 'tone'>) => void;
}

interface AppToastProviderProps {
  children: ReactNode;
}

const AppToastContext = createContext<AppToastContextValue | null>(null);

const DEFAULT_TITLES: Record<AppToastTone, string> = {
  success: 'Operacion completada',
  error: 'No se pudo completar la operacion',
  warning: 'Atencion',
  info: 'Informacion',
};

const TONE_COLORS: Record<AppToastTone, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export function AppToastProvider({ children }: AppToastProviderProps) {
  const showToast = useCallback((toast: AppToastInput) => {
    notifications.show({
      title: toast.title ?? DEFAULT_TITLES[toast.tone],
      message: toast.message,
      color: TONE_COLORS[toast.tone],
      autoClose: toast.autoClose,
    });
  }, []);

  const value = useMemo<AppToastContextValue>(
    () => ({
      showToast,
      success: (message, options) => showToast({ ...options, message, tone: 'success' }),
      error: (message, options) => showToast({ ...options, message, tone: 'error' }),
      warning: (message, options) => showToast({ ...options, message, tone: 'warning' }),
      info: (message, options) => showToast({ ...options, message, tone: 'info' }),
    }),
    [showToast],
  );

  return (
    <AppToastContext.Provider value={value}>
      {children}
      <Notifications
        position="top-right"
        zIndex={10000}
        limit={4}
        autoClose={3000}
        className=".mantine-Notifications-notification"
      />
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
