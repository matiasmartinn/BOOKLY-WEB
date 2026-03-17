import axios, { AxiosError } from 'axios';

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

const baseUrl = 'https://localhost:7176/api/';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  // const token = authStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    console.log(error);

    if (!error.response) {
      return Promise.reject<ProblemDetails>({
        status: 0,
        title: 'Sin conexión',
        detail: 'No se pudo conectar con el servidor. Verificá tu conexión.',
      });
    }

    const problem = error.response.data;

    if (!problem?.title) {
      return Promise.reject<ProblemDetails>({
        status: error.response.status,
        title: 'Error inesperado',
        detail: 'Ocurrió un error inesperado.',
      });
    }

    return Promise.reject(problem);
  },
);
