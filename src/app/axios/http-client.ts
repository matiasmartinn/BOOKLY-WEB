import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  // Ej: agregar token si lo tenés en un store
  // const token = authStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores, logs, etc.
    return Promise.reject(error);
  }
);
