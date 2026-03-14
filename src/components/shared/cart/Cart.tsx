import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemList } from "./CartItemList";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

export const Cart = () => {
    const isExpanded = useCartStore((state) => state.isExpanded);
    const toggleCart = useCartStore((state) => state.toggleCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const itemsLength = useCartStore((state) => state.items.length);

    const subtotal = useCartStore((state) => state.getSubtotal());
    const tax = useCartStore((state) => state.getTax());
    const discount = useCartStore((state) => state.getDiscount());
    const total = useCartStore((state) => state.getTotal());
    const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <div
            className={cn(
                "h-full bg-white transition-all duration-300 ease-in-out flex flex-col shrink-0 rounded-2xl border border-border shadow-xl overflow-hidden",
                isExpanded ? "w-[400px]" : "w-16 cursor-pointer hover:bg-slate-50"
            )}
            onClick={() => {
                if (!isExpanded) toggleCart();
            }}
        >
            {/* Colapsado */}
            {!isExpanded && (
                <div className="flex flex-col items-center py-6 h-full text-muted-foreground font-medium">
                    <div className="relative mb-8 mt-2">
                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-h-[100px]" />
                    <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        <span className="tracking-widest uppercase whitespace-nowrap text-sm">
                            {totalItems === 0 ? "Resumen de Venta - Vacío" : `Resumen de Venta - ${totalItems} items`}
                        </span>
                    </div>
                    <div className="flex-1" />
                </div>
            )}

            {/* Expandido */}
            {isExpanded && (
                <div className="flex flex-col h-full w-[400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-primary">Resumen de Venta</h2>
                            <p className="text-sm text-muted-foreground">Ticket #{(Math.floor(Math.random() * 90000) + 10000).toString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn("cursor-pointer p-2", itemsLength > 0 ? "text-red-500 hover:text-red-600" : "text-slate-300")} onClick={clearCart}>
                                <Trash2 className="h-5 w-5" />
                            </span>
                            <span className="text-muted-foreground hover:text-slate-600 cursor-pointer text-2xl px-2" onClick={toggleCart}>
                                &times;
                            </span>
                        </div>
                    </div>

                    {/* Lista de Items delegada a un subcomponente para no re-renderizar todo Cart */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <CartItemList />
                    </div>

                    {/* Resumen */}
                    <div className="p-6 bg-slate-50/50 shrink-0 space-y-4 border-t border-border">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-medium text-primary">${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Descuento</span>
                                <span className="font-medium text-red-500">-${discount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Impuestos</span>
                                <span className="font-medium text-primary">${tax.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-200 pt-4 mb-2">
                            <span className="text-xs font-bold text-muted-foreground tracking-wider">TOTAL NETO</span>
                            <span className="text-3xl font-bold text-profit">${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full bg-profit hover:bg-contrast text-primary font-bold h-12 text-lg rounded-xl"
                                onClick={() => setIsCheckoutOpen(true)}
                                disabled={itemsLength === 0}
                            >
                                COBRAR &rarr;
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 text-xs font-bold text-muted-foreground h-10 rounded-lg bg-white">
                                    ESPERA
                                </Button>
                                <Button variant="outline" className="flex-1 text-xs font-bold text-muted-foreground h-10 rounded-lg bg-white">
                                    PROFORMA
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </div>
    );
};
