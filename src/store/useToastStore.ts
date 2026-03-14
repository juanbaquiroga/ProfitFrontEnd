import { create } from 'zustand';
import { Toast, ToastType } from '@/types/toast.types';

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, description?: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, description) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      // Los nuevos se agregan al principio para que sean el "top" del stack
      toasts: [{ id, message, type, description, duration: 4000 }, ...state.toasts].slice(0, 5),
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));