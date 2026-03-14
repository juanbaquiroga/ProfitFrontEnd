import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    let token = useAppStore.getState().accessToken;

    if (!token && typeof window !== 'undefined') {
        const storage = localStorage.getItem('app-storage');
        if (storage) {
            try {
                const parsed = JSON.parse(storage);
                token = parsed.state?.accessToken;
            } catch (e) {
                console.error("Error leyendo app-storage", e);
            }
        }
    }

    const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (token && !isAuthRequest) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                let currentRefreshToken = useAppStore.getState().refreshToken;

                if (!currentRefreshToken && typeof window !== 'undefined') {
                    const storage = localStorage.getItem('app-storage');
                    if (storage) {
                        try {
                            const parsed = JSON.parse(storage);
                            currentRefreshToken = parsed.state?.refreshToken;
                        } catch (e) { }
                    }
                }

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                    refreshToken: currentRefreshToken,
                });

                const { accessToken } = response.data;

                useAppStore.getState().updateAccessToken(accessToken);

                originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
                return api(originalRequest);

            } catch (refreshError) {
                useAppStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;