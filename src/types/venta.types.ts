export interface LineaVentaDTO {
    id?: number;
    productoId: number;
    productoNombre: string;
    categoriaNombre?: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface VentaDTO {
    id: number;
    fecha: string;
    total: number;
    lineas: LineaVentaDTO[];
}
