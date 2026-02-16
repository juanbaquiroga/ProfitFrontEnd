import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// 1. Interceptor de Petición: Agrega el token a cada mensaje
api.interceptors.request.use((config) => {
    const token = useAppStore.getState().accessToken;
    const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (token && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Interceptor de Respuesta: Maneja el Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si es 401 y no hemos reintentado ya...
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const currentRefreshToken = useAppStore.getState().refreshToken;

                // Llamada a tu endpoint de Java para refrescar
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                    refreshToken: currentRefreshToken,
                });

                const { accessToken } = response.data;

                // Actualizamos el store
                useAppStore.getState().updateAccessToken(accessToken);

                // Reintentamos la petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Si el refresh también falla, al login de cabeza
                useAppStore.getState().logout();
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;