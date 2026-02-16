export interface User {
    id: string;
    username: string;
    name: string;
    lastName: string;
    role: string;
}

export interface LoginRequest {
    nombreUsuario: string;
    password: string;
}

export interface SignupRequest {
    nombreUsuario: string;
    password: string;
    nombre: string;
    apellido: string;
}

export interface UserResponse {
    expiresIn: number;
    usuario: User;
    mensaje: string;
    accessToken: string;
    tokenType: string;
    refreshToken: string;
}