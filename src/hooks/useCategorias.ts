import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { CategoriaDTO } from '@/types/product.types';

export const useCategorias = () => {
    return useQuery<CategoriaDTO[]>({
        queryKey: ['categorias'],
        queryFn: async () => {
            const { data } = await api.get('/categorias');
            return data;
        },
    });
};
