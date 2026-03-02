"use client"
import { useState } from "react";
import { authService } from "@/services/authService";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff, LogIn, UserPlus, Store } from "lucide-react";

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (formData: FormData) => {
        const nombreUsuario = formData.get("nombreUsuario") as string;
        const password = formData.get("password") as string;
        // Optionally handle `recordar` here if needed for localstorage/cookies
        const recordar = formData.get("recordar") === "on";

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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-card rounded-[24px] p-8 lg:p-10 shadow-xl border border-slate-100 flex flex-col justify-center space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        ¡Bienvenido!
                    </h1>
                    <p className="text-sm text-slate-500">
                        Por favor, ingresa a tu cuenta
                    </p>
                </div>

                <form action={onSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="nombreUsuario" className="text-slate-500 font-medium ml-1">Usuario</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <Input
                                    id="nombreUsuario"
                                    name="nombreUsuario"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    className="pl-11 bg-slate-50 border-slate-200 rounded-xl py-6 text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center ml-1">
                                <Label htmlFor="password" className="text-slate-500 font-medium">Contraseña</Label>
                                <Link href="#" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                                    ¿Olvidé mi contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-11 pr-11 bg-slate-50 border-slate-200 rounded-xl py-6 text-foreground"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pl-1">
                            <input
                                type="checkbox"
                                id="recordar"
                                name="recordar"
                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary"
                            />
                            <Label htmlFor="recordar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer">
                                Recordar mis credenciales
                            </Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-xl py-6 shadow-sm hover:shadow-md transition-all text-base font-medium flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="space-y-6">
                    <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                        ¿No tienes cuenta?
                        <Link
                            href="/signup"
                            className="font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            <UserPlus className="w-4 h-4" />
                            Regístrate
                        </Link>
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex justify-center gap-6">
                        <Link href="#" className="text-xs text-slate-400 hover:text-slate-500 transition-colors">
                            Soporte
                        </Link>
                        <Link href="#" className="text-xs text-slate-400 hover:text-slate-500 transition-colors">
                            Términos
                        </Link>
                        <Link href="#" className="text-xs text-slate-400 hover:text-slate-500 transition-colors">
                            Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
