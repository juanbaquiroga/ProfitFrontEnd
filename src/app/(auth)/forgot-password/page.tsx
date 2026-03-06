"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, LogIn, Mail } from "lucide-react";

const ForgotPassword = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 space-y-8">
            {/* Header / Brand */}
            <div className="flex flex-col items-center text-center space-y-3">
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

            <div className="w-full max-w-md bg-card rounded-[24px] p-8 lg:p-10 shadow-xl border border-slate-100 flex flex-col justify-center space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Recuperar cuenta
                    </h1>
                    <p className="text-sm text-slate-500">
                        Ingresa tu usuario o correo electrónico para recuperar tu acceso.
                    </p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="identificador" className="text-slate-500 font-medium ml-1">Usuario / Email</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="identificador"
                                    name="identificador"
                                    type="text"
                                    placeholder="Ingresa tu usuario o email"
                                    className="pl-11 bg-slate-50 border-slate-200 rounded-xl py-6 text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="button" className="w-full bg-primary text-primary-foreground rounded-xl py-6 shadow-sm hover:shadow-md transition-all text-base font-medium flex items-center justify-center gap-2 cursor-pointer">
                            Enviar instrucciones
                        </Button>
                    </div>
                </form>

                <div className="space-y-6">
                    <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                        ¿Recuerdas tu contraseña?
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
