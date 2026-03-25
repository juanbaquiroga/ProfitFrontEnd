"use client";

import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { ShoppingBag, Banknote, CreditCard, QrCode, CheckCircle2, Delete, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/axios";
import { useCreateSale } from "@/hooks/useVentas";
import { useHotkey } from "@tanstack/react-hotkeys";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
    const {
        items,
        getSubtotal,
        getTax,
        getTotal,
        clearCart,
    } = useCartStore();

    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();

    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qr">("cash");
    const [amountReceivedStr, setAmountReceivedStr] = useState<string>("0");
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const createSaleMutation = useCreateSale();

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setPaymentMethod("cash");
            setAmountReceivedStr("0");
            setPaymentStatus("idle");
            setErrorMessage("");
        }
    }, [isOpen]);

    const amountReceived = parseFloat(amountReceivedStr) || 0;
    const changeToReturn = amountReceived - total;
    const isSufficientAmount = amountReceived >= total;

    const handleNumpadPress = useCallback((val: string) => {
        if (val === "del") {
            setAmountReceivedStr(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
            return;
        }

        if (val === ".") {
            if (!amountReceivedStr.includes(".")) {
                setAmountReceivedStr(prev => prev + ".");
            }
            return;
        }

        setAmountReceivedStr(prev => {
            if (prev === "0" && val !== ".") {
                return val;
            }
            // Limit to 2 decimal places max
            if (prev.includes(".")) {
                const decimals = prev.split(".")[1];
                if (decimals && decimals.length >= 2) return prev;
            }
            // Limit length to something reasonable
            if (prev.length >= 8) return prev;

            return prev + val;
        });
    }, [amountReceivedStr]);

    // Keyboard support for numpad using @tanstack/react-hotkeys
    useHotkey('0', () => isOpen && handleNumpadPress("0"));
    useHotkey('1', () => isOpen && handleNumpadPress("1"));
    useHotkey('2', () => isOpen && handleNumpadPress("2"));
    useHotkey('3', () => isOpen && handleNumpadPress("3"));
    useHotkey('4', () => isOpen && handleNumpadPress("4"));
    useHotkey('5', () => isOpen && handleNumpadPress("5"));
    useHotkey('6', () => isOpen && handleNumpadPress("6"));
    useHotkey('7', () => isOpen && handleNumpadPress("7"));
    useHotkey('8', () => isOpen && handleNumpadPress("8"));
    useHotkey('9', () => isOpen && handleNumpadPress("9"));
    useHotkey('.', () => isOpen && handleNumpadPress("."));
    useHotkey(',', () => isOpen && handleNumpadPress("."));

    useHotkey('Backspace', () => isOpen && handleNumpadPress("del"));
    useHotkey('Delete', () => isOpen && handleNumpadPress("del"));

    useHotkey('Enter', () => {
        if (!isOpen) return;
        if (isSufficientAmount || paymentMethod !== "cash") {
            handleConfirm();
        }
    });

    useHotkey('Escape', () => {
        if (isOpen) handleModalClose();
    });

    const handleQuickAmount = (amount: number) => {
        if (paymentStatus === "processing" || paymentStatus === "success") return;
        setAmountReceivedStr(amount.toString());
    };

    const handleModalClose = useCallback(() => {
        if (paymentStatus === "success") {
            clearCart();
        }
        onClose();
    }, [paymentStatus, clearCart, onClose]);

    const handleConfirm = async () => {
        if (!isSufficientAmount && paymentMethod === "cash") return;

        setPaymentStatus("processing");
        setErrorMessage("");

        try {
            // Check stock for all items
            for (const item of items) {
                const { data: productoDB } = await api.get(`/productos/${item.product.productoId}`);
                if (productoDB.stock < item.quantity) {
                    setPaymentStatus("error");
                    setErrorMessage(`Sin stock suficiente para: ${item.product.nombre} (Stock actual: ${productoDB.stock})`);
                    return;
                }
            }

            // If stock is sufficient, create sale
            const payload = items.map(item => ({
                producto: {
                    productoId: item.product.productoId,
                },
                cantidad: item.quantity
            }))
            console.log(payload)

            await createSaleMutation.mutateAsync(payload);
            setPaymentStatus("success");

            // Wait to show animation and then close
            setTimeout(() => {
                // If the user hasn't closed it manually yet
                clearCart();
                onClose();
            }, 2000);

        } catch (error) {
            console.error(error);
            setPaymentStatus("error");
            setErrorMessage("Ocurrió un error al procesar la venta.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if(!open) handleModalClose() }}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-none max-w-none w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-3xl gap-0 flex flex-col md:flex-row shadow-2xl"
                style={{ width: "min(90vw, 850px)" }}
            >
                {/* Accessible title hidden visually */}
                <VisuallyHidden.Root>
                    <DialogTitle>Cobrar venta</DialogTitle>
                </VisuallyHidden.Root>

                {/* Left Side: Order Summary */}
                <div className={cn("w-full md:w-[300px] shrink-0 bg-slate-50 p-6 flex flex-col border-r border-slate-200/60 overflow-y-auto transition-opacity", (paymentStatus === "success" || paymentStatus === "processing") ? "opacity-50 pointer-events-none" : "")}>
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingBag className="w-5 h-5 text-profit" />
                        <h2 className="text-lg font-bold text-primary">Resumen de Venta</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                        {items.map((item) => (
                            <div key={item.product.codigo} className="flex gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-semibold text-primary text-sm truncate">{item.product.nombre}</p>
                                        <p className="font-bold text-primary text-sm shrink-0">
                                            ${(item.product.precioVenta * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        x{item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200/60 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-medium text-primary">${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Impuestos</span>
                            <span className="font-medium text-primary">${tax.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="font-bold text-primary">Total</span>
                            <span className="text-xl font-bold text-profit">${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Method */}
                <div className="flex-1 bg-white p-6 relative flex flex-col overflow-y-auto min-h-[500px]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full z-10"
                        onClick={handleModalClose}
                        disabled={paymentStatus === "processing"}
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    <h2 className="text-xl font-bold text-primary mb-6">Método de Pago</h2>

                    {/* Payment Method Tabs */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <button
                            onClick={() => setPaymentMethod("cash")}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                                paymentMethod === "cash"
                                    ? "border-profit bg-profit/10 text-profit"
                                    : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {paymentMethod === "cash" && (
                                <div className="absolute top-2 right-2 text-profit">
                                    <CheckCircle2 className="w-4 h-4 fill-profit text-white" />
                                </div>
                            )}
                            <Banknote className="w-6 h-6" />
                            <span className="text-xs font-semibold">Efectivo</span>
                        </button>

                        <button
                            disabled
                            onClick={() => setPaymentMethod("card")}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all opacity-60 cursor-not-allowed",
                                paymentMethod === "card"
                                    ? "border-profit bg-profit/10 text-profit"
                                    : "border-slate-100 bg-white text-slate-400"
                            )}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-xs font-semibold">Tarjeta</span>
                        </button>

                        <button
                            disabled
                            onClick={() => setPaymentMethod("qr")}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all opacity-60 cursor-not-allowed",
                                paymentMethod === "qr"
                                    ? "border-profit bg-profit/10 text-profit"
                                    : "border-slate-100 bg-white text-slate-400"
                            )}
                        >
                            <QrCode className="w-6 h-6" />
                            <span className="text-xs font-semibold">QR Code</span>
                        </button>
                    </div>

                    {/* Amount Section */}
                    <div className="flex gap-6 mb-6 min-h-[200px]">
                        {/* Left Col: Amount and Change */}
                        <div className="flex-1 flex flex-col justify-between gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                                    MONTO RECIBIDO
                                    <span className="ml-2 normal-case font-normal text-profit/70">(usa el teclado numérico)</span>
                                </label>
                                <div className="h-16 border-2 border-profit rounded-xl px-4 flex items-center bg-white shadow-sm overflow-hidden ring-2 ring-profit/20">
                                    <span className="text-muted-foreground font-bold text-xl mr-1">$</span>
                                    <span className="text-3xl font-bold text-primary truncate">{amountReceivedStr}</span>
                                    <span className="ml-1 w-0.5 h-8 bg-profit animate-pulse rounded-full" />
                                </div>
                            </div>

                            <div className={cn(
                                "rounded-xl p-4 flex flex-col items-center justify-center border flex-1",
                                changeToReturn >= 0
                                    ? "bg-profit/5 border-profit/20"
                                    : "bg-red-50/50 border-red-100/50"
                            )}>
                                <span className={cn(
                                    "text-xs font-semibold mb-1",
                                    changeToReturn >= 0 ? "text-profit" : "text-red-400"
                                )}>
                                    Vuelto a entregar
                                </span>
                                <span className={cn(
                                    "text-3xl font-bold",
                                    changeToReturn >= 0 ? "text-profit" : "text-red-400"
                                )}>
                                    ${Math.max(0, changeToReturn).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Right Col: Numpad */}
                        <div className="w-[200px] grid grid-cols-3 gap-2 content-start">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handleNumpadPress(num.toString())}
                                    className="bg-slate-50 hover:bg-profit/10 hover:text-profit text-primary font-bold text-lg rounded-xl flex items-center justify-center transition-colors h-[44px] border border-slate-100 hover:border-profit/30"
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => handleNumpadPress(".")}
                                className="bg-slate-50 hover:bg-profit/10 hover:text-profit text-primary font-bold text-xl rounded-xl flex items-center justify-center transition-colors h-[44px] border border-slate-100 hover:border-profit/30"
                            >
                                .
                            </button>
                            <button
                                onClick={() => handleNumpadPress("0")}
                                className="bg-slate-50 hover:bg-profit/10 hover:text-profit text-primary font-bold text-lg rounded-xl flex items-center justify-center transition-colors h-[44px] border border-slate-100 hover:border-profit/30"
                            >
                                0
                            </button>
                            <button
                                onClick={() => handleNumpadPress("del")}
                                className="bg-red-50 hover:bg-red-100 text-red-400 rounded-xl flex items-center justify-center transition-colors h-[44px] border border-red-100"
                            >
                                <Delete className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Amounts */}
                    <div className="flex gap-2 mb-6">
                        {[1000, 2000, 10000, 20000].map(amount => (
                            <button
                                key={amount}
                                onClick={() => handleQuickAmount(amount)}
                                className="flex-1 bg-white border border-slate-200 hover:border-profit hover:bg-profit/5 hover:text-profit text-primary font-semibold text-sm rounded-lg py-2 transition-colors"
                            >
                                ${amount.toLocaleString('es-AR')}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mt-auto">
                        {paymentStatus === "error" && (
                            <div className="bg-red-50 text-red-500 text-sm font-semibold p-3 text-center rounded-xl border border-red-100">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-14 rounded-xl border-slate-200 text-muted-foreground font-bold text-sm bg-white hover:bg-slate-50"
                                onClick={handleModalClose}
                                disabled={paymentStatus === "processing"}
                            >
                                {paymentStatus === "success" ? "Cerrar" : "Cancelar"}
                            </Button>
                            <Button
                                className="flex-2 h-14 rounded-xl bg-profit hover:bg-contrast text-primary font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={(paymentMethod === "cash" && !isSufficientAmount) || paymentStatus === "processing" || paymentStatus === "success"}
                                onClick={handleConfirm}
                            >
                                {paymentStatus === "processing" ? "Procesando..." : paymentStatus === "success" ? "Completado" : "Confirmar Pago"}
                                {paymentStatus === "idle" || paymentStatus === "error" ? <span className="text-lg leading-none">&rarr;</span> : null}
                            </Button>
                        </div>
                    </div>

                    {/* Overlay Success Animation */}
                    {paymentStatus === "success" && (
                        <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in spin-in-12 duration-500">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Venta Exitosa!</h2>
                            <p className="text-muted-foreground font-medium">Imprimiendo ticket...</p>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};
