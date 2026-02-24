import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product } from '@/types/product.types';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/productos');
      return data;
    },
  });
};