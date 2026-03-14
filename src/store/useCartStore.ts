import { create } from 'zustand';
import { Product } from '@/types/product.types';
import { useToastStore } from '@/store/useToastStore';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isExpanded: boolean;
    addItem: (product: Product, quantityToAdd?: number) => void;
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

    addItem: (product, quantityToAdd = 1) => {
        if (product.stock <= 0) {
            useToastStore.getState().addToast('Producto sin stock', 'warning', `No hay stock disponible para ${product.nombre}`);
            return; // Validación inicial
        }

        set((state) => {
            const existingItem = state.items.find(item => item.product.codigo === product.codigo);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    useToastStore.getState().addToast('Stock máximo alcanzado', 'warning', `Solo hay ${product.stock} unidades disponibles de ${product.nombre}`);
                    return state; // No hacer nada si ya se alcanzó el límite de stock
                }
                
                // Calcular la nueva cantidad sin exceder el stock
                const newQuantity = Math.min(existingItem.quantity + quantityToAdd, product.stock);
                if (existingItem.quantity + quantityToAdd > product.stock) {
                    useToastStore.getState().addToast('Stock límite alcanzado', 'warning', `Se agregaron las unidades disponibles para llegar al máximo de ${product.stock}`);
                }
                
                return {
                    items: state.items.map(item =>
                        item.product.codigo === product.codigo
                            ? { ...item, quantity: newQuantity }
                            : item
                    ),
                    isExpanded: true,
                };
            }
            
            // Si es un producto nuevo, limitar la cantidad inicial al stock
            const initialQuantity = Math.min(quantityToAdd, product.stock);
            if (quantityToAdd > product.stock) {
                useToastStore.getState().addToast('Stock límite alcanzado', 'warning', `Se agregaron ${product.stock} unidades al ser el máximo en stock`);
            }
            
            return {
                items: [...state.items, { product, quantity: initialQuantity }],
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
                if (quantity > item.product.stock) {
                    useToastStore.getState().addToast('Stock máximo alcanzado', 'warning', `Solo hay ${item.product.stock} unidades de ${item.product.nombre}`);
                }
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
