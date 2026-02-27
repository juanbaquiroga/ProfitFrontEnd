import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, ProductoDTO } from '@/types/product.types';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/productos');
      return data;
    },
  });
};

export const useCrearProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoProducto: Omit<ProductoDTO, 'productoId'>) => {
      const { data } = await api.post('/productos', nuevoProducto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useActualizarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, producto }: { id: number, producto: Omit<ProductoDTO, 'productoId'> }) => {
      const { data } = await api.put(`/productos/${id}`, producto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};