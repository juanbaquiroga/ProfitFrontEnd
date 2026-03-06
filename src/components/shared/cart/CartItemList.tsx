import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";

export const CartItemList = () => {
    // Suscribirse solo a los items del carrito para este componente
    const items = useCartStore((state) => state.items);

    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted gap-4">
                <ShoppingCart className="h-16 w-16" />
                <p>El carrito está vacío</p>
            </div>
        );
    }

    return (
        <>
            {items.map((item) => {
                const id = item.product.productoId || item.product.codigo;
                return <CartItem key={id} item={item} />;
            })}
        </>
    );
};
