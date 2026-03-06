import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { VentaDTO } from '@/types/venta.types';

export const useVentas = () => {
    return useQuery<VentaDTO[]>({
        queryKey: ['ventas'],
        queryFn: async () => {
            const { data } = await api.get('/ventas');
            return data;
        },
    });
};

export const useCreateSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSale: any) => {
            const { data } = await api.post('/ventas', newSale);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventas'] });
            // You might also want to invalidate products to reflect stock changes
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
