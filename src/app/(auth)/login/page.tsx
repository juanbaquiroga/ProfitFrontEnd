"use client"
import { authService } from "@/services/authService";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();

    const onSubmit = async (formData: FormData) => {
        const nombreUsuario = formData.get("nombreUsuario") as string;
        const password = formData.get("password") as string;

        try {
            const response = await authService.login({ nombreUsuario, password });
            console.log('login exitoso \n', response);
            useAppStore.getState().setAuth(response.usuario, response.accessToken, response.refreshToken);
            console.log("estado actualizado \n", useAppStore.getState());

            // Redirigir al dashboard
            router.push("/dashboard");

        } catch (error) {
            console.error("Credenciales inválidas");
        }
    };

    return (
        <div className="flex flex-col justify-start p-16 rounded-2xl bg-white">
            <h1 className="text-3xl font-bold mb-8">Login</h1>
            <form action={onSubmit} className="flex flex-col gap-4">
                <input className="px-1 py-0.5 border border-stone-100 bg-stone-300 rounded-md" name="nombreUsuario" type="text" placeholder="Usuario" />
                <input className="px-1 py-0.5 border border-stone-400 rounded-md" name="password" type="password" placeholder="Contraseña" />
                <button className="h-auto w-auto p-2 bg-profit text-white rounded-md" type="submit">Iniciar Sesión</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
                ¿No tienes cuenta?{" "}
                <Link
                    href="/auth/signup"
                    className="font-semibold text-profit hover:text-profit/80 transition-colors"
                >
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
};

export default Login;
