"use client"
import { authService } from "@/services/authService";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

const onSubmit = async (formData: FormData) => {
    const nombreUsuario = formData.get("nombreUsuario") as string;
    const password = formData.get("password") as string;
    const nombre = formData.get("nombre") as string;
    const apellido = formData.get("apellido") as string;

    try {
        const response = await authService.signup({ nombreUsuario, password, nombre, apellido });
        console.log('registro exitoso \n', response);
        useAppStore.getState().setAuth(response.usuario, response.accessToken, response.refreshToken);
        console.log("estado actualizado \n", useAppStore.getState());
    } catch (error) {
        console.error("Error al registrarse");
    }
};
const Signup = () => {
    return (
        <div className="flex flex-col justify-start p-16 rounded-2xl bg-white">
            <h1 className="text-3xl font-bold mb-8">Registro</h1>

            <form className="flex flex-col gap-4" action={onSubmit}>
                <input className="px-1 py-0.5 border border-stone-400 rounded-md" name="nombreUsuario" type="text" placeholder="Usuario" />
                <input className="px-1 py-0.5 border border-stone-400 rounded-md" name="password" type="password" placeholder="Contraseña" />
                <input className="px-1 py-0.5 border border-stone-400 rounded-md" name="nombre" type="text" placeholder="Nombre" />
                <input className="px-1 py-0.5 border border-stone-400 rounded-md" name="apellido" type="text" placeholder="Apellido" />
                <button className="h-auto w-auto p-2 bg-profit text-white rounded-md" type="submit">Registrarse</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <Link
                    href="/auth/login"
                    className="font-semibold text-profit hover:text-profit/80 transition-colors"
                >
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    );
};

export default Signup;