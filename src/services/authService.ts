import api from '@/lib/axios';
import { LoginRequest, SignupRequest, UserResponse } from '@/types/user.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<UserResponse> => {
    console.log("credentials ", credentials);
    const { data } = await api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return data;
  },
  signup: async (credentials: SignupRequest): Promise<UserResponse> => {
    const { data } = await api.post('/auth/register', {
      nombreUsuario: credentials.nombreUsuario,
      password: credentials.password,
      nombre: credentials.nombre,
      apellido: credentials.apellido,
      rolId: 2,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return data;
  },
  refresh: async (refreshToken: string): Promise<UserResponse> => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },
};