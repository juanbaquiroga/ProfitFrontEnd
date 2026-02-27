import { create } from 'zustand';
import { Product } from '@/types/product.types';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isExpanded: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: number | string) => void;
    updateQuantity: (productId: number | string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setExpanded: (expanded: boolean) => void;
    getSubtotal: () => number;
    getDiscount: () => number;
    getTax: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isExpanded: false,

    addItem: (product) => {
        if (product.stock <= 0) return; // Validación inicial

        set((state) => {
            const existingItem = state.items.find(item => item.product.codigo === product.codigo);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    return state; // No hacer nada si ya se alcanzó el límite de stock
                }
                return {
                    items: state.items.map(item =>
                        item.product.codigo === product.codigo
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    isExpanded: true,
                };
            }
            return {
                items: [...state.items, { product, quantity: 1 }],
                isExpanded: true,
            };
        });
    },

    removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product.codigo !== productId)
    })),

    updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => {
            if (item.product.codigo === productId) {
                // Asegurarse de no superar el stock y no ser menor a 0
                const clampedQuantity = Math.min(Math.max(0, quantity), item.product.stock);
                return { ...item, quantity: clampedQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0)
    })),

    clearCart: () => set({ items: [] }),

    toggleCart: () => set((state) => ({ isExpanded: !state.isExpanded })),

    setExpanded: (expanded) => set({ isExpanded: expanded }),

    getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.product.precioVenta * item.quantity), 0);
    },

    getDiscount: () => {
        return 0; // integrar lógica de descuentos
    },

    getTax: () => {
        const taxable = get().getSubtotal() - get().getDiscount();
        return 0; // integrar lógica de impuestos
    },

    getTotal: () => {
        return get().getSubtotal() - get().getDiscount() + get().getTax();
    }
}));
