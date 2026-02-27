import { z } from "zod";

export const productSchema = z.object({
    codigo: z.string().min(1, "El código es requerido"),
    nombre: z.string().min(1, "El nombre es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    disponible: z.boolean(),
    stock: z.number().min(0, "El stock no puede ser negativo"),
    proveedor: z.string().min(1, "El proveedor es requerido"),
    precioCompra: z.number().min(0, "El precio de compra no puede ser negativo"),
    precioVenta: z.number().min(0, "El precio de venta no puede ser negativo"),
    categoriaId: z.number().min(1, "Debe seleccionar una categoría"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
