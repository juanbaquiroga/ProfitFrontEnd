import { useQuery } from '@tanstack/react-query';
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
