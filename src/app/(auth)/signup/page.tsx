"use client"
import { authService } from "@/services/authService";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
const Signup = () => {
    const router = useRouter();
    const [showWelcome, setShowWelcome] = useState(false);

    const onSubmit = async (formData: FormData) => {
        const nombreNegocio = formData.get("nombreNegocio") as string;
        const direccionNegocio = formData.get("direccionNegocio") as string;
        const nombre = formData.get("nombre") as string;
        const apellido = formData.get("apellido") as string;
        const email = formData.get("email") as string;
        const emailRecuperacion = formData.get("emailRecuperacion") as string;
        const telefono = formData.get("telefono") as string;
        const nombreUsuario = formData.get("nombreUsuario") as string;
        const password = formData.get("password") as string;

        try {
            const response = await authService.signup({
                nombreNegocio,
                direccionNegocio,
                nombre,
                apellido,
                email,
                emailRecuperacion,
                telefono,
                nombreUsuario,
                password
            });
            console.log('Registro exitoso \n', response);
            useAppStore.getState().setAuth(response.usuario, response.accessToken, response.refreshToken);
            setShowWelcome(true);
        } catch (error) {
            console.error("Error al registrarse", error);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 py-8">
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <ShoppingCart className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        PROFIT
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Sistema de gestión de ventas y stock
                    </p>
                </div>
            </div>

            <div className="w-full max-w-2xl bg-card rounded-[24px] p-8 lg:p-10 shadow-xl border border-slate-100 flex flex-col justify-center space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Crea tu negocio
                    </h1>
                    <p className="text-sm text-slate-500">
                        Completa la información para configurar tu sistema
                    </p>
                </div>

                <form action={onSubmit} className="space-y-8">

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Datos del Negocio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="nombreNegocio" className="text-slate-500 font-medium ml-1">Nombre del Local</Label>
                                <Input id="nombreNegocio" name="nombreNegocio" type="text" placeholder="Ej. Kiosco El Sol" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="direccionNegocio" className="text-slate-500 font-medium ml-1">Dirección</Label>
                                <Input id="direccionNegocio" name="direccionNegocio" type="text" placeholder="Calle Falsa 123" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Información de Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="nombre" className="text-slate-500 font-medium ml-1">Nombre</Label>
                                <Input id="nombre" name="nombre" type="text" placeholder="Tu nombre" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="apellido" className="text-slate-500 font-medium ml-1">Apellido</Label>
                                <Input id="apellido" name="apellido" type="text" placeholder="Tu apellido" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="telefono" className="text-slate-500 font-medium ml-1">Teléfono</Label>
                                <Input id="telefono" name="telefono" type="tel" placeholder="+54 9 ..." className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="email" className="text-slate-500 font-medium ml-1">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="emailRecuperacion" className="text-slate-500 font-medium ml-1">Correo de Recuperación (Alternativo)</Label>
                            <Input id="emailRecuperacion" name="emailRecuperacion" type="email" placeholder="respaldo@ejemplo.com" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Credenciales de Acceso</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="nombreUsuario" className="text-slate-500 font-medium ml-1">Usuario Administrador</Label>
                                <Input id="nombreUsuario" name="nombreUsuario" type="text" placeholder="Crea tu usuario" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="password" className="text-slate-500 font-medium ml-1">Contraseña</Label>
                                <Input id="password" name="password" type="password" placeholder="••••••••" minLength={6} className="bg-slate-50 border-slate-200 rounded-xl px-4 py-6 text-foreground" required />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-xl py-6 shadow-sm hover:shadow-md transition-all text-base font-medium flex items-center justify-center gap-2 cursor-pointer mt-4">
                        <UserPlus className="w-5 h-5" />
                        Registrar Negocio
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>

            <Dialog open={showWelcome} onOpenChange={(open) => {
                if (!open) router.push('/dashboard');
            }}>
                <DialogContent className="sm:max-w-md text-center p-8 z-[100]" showCloseButton={false}>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-800">¡Cuenta Creada!</DialogTitle>
                        <DialogDescription className="text-base text-slate-500 mt-2">
                            Tu negocio ha sido registrado exitosamente. Ya puedes empezar a gestionar tus ventas y stock de manera sencilla.
                        </DialogDescription>
                    </div>
                    <DialogFooter className="sm:justify-center mt-8">
                        <Button
                            className="w-full bg-primary text-primary-foreground rounded-xl py-6 shadow-sm hover:shadow-md transition-all text-base font-medium"
                            onClick={() => router.push('/dashboard')}
                        >
                            Ir al Dashboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Signup;