import { Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

import { Product } from "@/types/product.types";

interface CartItemProps {
    item: {
        product: Product;
        quantity: number;
    };
}

export const CartItem = ({ item }: CartItemProps) => {
    const { updateQuantity } = useCartStore();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-primary max-w-[200px] leading-tight flex-1 flex-wrap">
                    {item.product.nombre}
                </span>
                <span className="font-bold text-sm text-primary">
                    ${(item.product.precioVenta * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>${item.product.precioVenta.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u</span>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button
                        className="px-2 py-1 hover:bg-accent"
                        onClick={() => updateQuantity(item.product.codigo, item.quantity - 1)}
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold w-6 text-center text-primary">{item.quantity}</span>
                    <button
                        className="px-2 py-1 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQuantity(item.product.codigo, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};
