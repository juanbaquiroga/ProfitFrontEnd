"use client"
import { authService } from "@/services/authService";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

const Signup = () => {
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

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 py-8">
            <div className="w-full max-w-md bg-card rounded-[24px] p-8 lg:p-10 shadow-xl border border-slate-100 flex flex-col justify-center space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Crea tu cuenta
                    </h1>
                    <p className="text-sm text-slate-500">
                        Ingresa tus datos para registrarte
                    </p>
                </div>

                <form action={onSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="nombre" className="text-slate-500 font-medium ml-1">Nombre</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground"
                                    required
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="apellido" className="text-slate-500 font-medium ml-1">Apellido</Label>
                                <Input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    placeholder="Tu apellido"
                                    className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="nombreUsuario" className="text-slate-500 font-medium ml-1">Usuario</Label>
                            <Input
                                id="nombreUsuario"
                                name="nombreUsuario"
                                type="text"
                                placeholder="Crea un nombre de usuario"
                                className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground"
                                required
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="password" className="text-slate-500 font-medium ml-1">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-xl py-6 shadow-sm hover:shadow-md transition-all text-base font-medium flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Registrarse
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;