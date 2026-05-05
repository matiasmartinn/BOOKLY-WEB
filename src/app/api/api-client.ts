import type { AxiosError } from 'axios';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'store/use-auth-store';

declare module 'axios' {
  // Axios declara este parametro como any; la extension debe conservar la firma original.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface AxiosRequestConfig<D = any> {
    data?: D;
    skipAuth?: boolean;
    skipAuthRefresh?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface InternalAxiosRequestConfig<D = any> {
    data?: D;
    _retry?: boolean;
    skipAuth?: boolean;
    skipAuthRefresh?: boolean;
  }
}

export interface ProblemDetails {
  title: string;
  detail: string;
  status: number;
  instance?: string;
}

export function isApiError(error: unknown): error is ProblemDetails {
  return (
    typeof error === 'object' &&
    error !== null &&
    'title' in error &&
    'detail' in error &&
    'status' in error
  );
}

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuth?: boolean;
  skipAuthRefresh?: boolean;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let refreshSessionPromise: Promise<string | null> | null = null;

function setAuthorizationHeader(config: InternalAxiosRequestConfig, accessToken: string) {
  const headers = config.headers as Record<string, unknown>;
  headers.Authorization = `Bearer ${accessToken}`;
}

function hasAuthorizationHeader(config: InternalAxiosRequestConfig): boolean {
  const headers = config.headers as Record<string, unknown>;
  return Boolean(headers.Authorization || headers.authorization);
}

function toProblemDetails(error: AxiosError<ProblemDetails>): ProblemDetails {
  if (!error.response) {
    return {
      status: 0,
      title: 'Sin conexion',
      detail: 'No se pudo conectar con el servidor. Verifica tu conexion.',
    };
  }

  const problem = error.response.data;

  if (!problem?.title) {
    return {
      status: error.response.status,
      title: 'Error inesperado',
      detail: 'Ocurrio un error inesperado.',
    };
  }

  return problem;
}

apiClient.interceptors.request.use((config) => {
  const authConfig = config as AuthRequestConfig;
  const accessToken = useAuthStore.getState().session?.accessToken;

  if (!accessToken || authConfig.skipAuth || hasAuthorizationHeader(config)) {
    return config;
  }

  setAuthorizationHeader(config, accessToken);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails>) => {
    const originalRequest = error.config as AuthRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      const authStore = useAuthStore.getState();
      originalRequest._retry = true;

      try {
        if (!refreshSessionPromise) {
          refreshSessionPromise = authStore
            .refreshSession()
            .then((session) => session?.accessToken ?? null)
            .finally(() => {
              refreshSessionPromise = null;
            });
        }

        const refreshedAccessToken = await refreshSessionPromise;

        if (!refreshedAccessToken) {
          authStore.clearSession();
          return Promise.reject<ProblemDetails>(toProblemDetails(error));
        }

        setAuthorizationHeader(originalRequest, refreshedAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        authStore.clearSession();

        if (isApiError(refreshError)) {
          return Promise.reject<ProblemDetails>(refreshError);
        }

        return Promise.reject<ProblemDetails>(toProblemDetails(error));
      }
    }

    return Promise.reject<ProblemDetails>(toProblemDetails(error));
  },
);
