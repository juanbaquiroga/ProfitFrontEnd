"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormValues, productSchema } from "@/lib/validations/productSchema";
import { Product, ProductoDTO } from "@/types/product.types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCategorias } from "@/hooks/useCategorias";
import { useEffect } from "react";
import { Save, X } from "lucide-react";

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: Omit<ProductoDTO, 'productoId'>) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) => {
    const { data: categorias } = useCategorias();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            codigo: "",
            nombre: "",
            descripcion: "",
            proveedor: "",
            disponible: true,
            stock: 0,
            precioCompra: 0,
            precioVenta: 0,
            categoriaId: 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                codigo: initialData.codigo,
                nombre: initialData.nombre,
                descripcion: initialData.descripcion,
                proveedor: initialData.proveedor,
                disponible: initialData.disponible,
                stock: initialData.stock,
                precioCompra: initialData.precioCompra,
                precioVenta: initialData.precioVenta,
                categoriaId: initialData.categoria.categoriaId,
            });
        }
    }, [initialData, form]);

    const submitHandler = (values: ProductFormValues) => {
        const { categoriaId, ...restValues } = values;

        const payload = {
            ...restValues,
            categoria: {
                categoriaId: categoriaId
            }
        };

        onSubmit(payload as any);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="flex flex-col h-full justify-between flex-1">
                <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="codigo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Código SKU</FormLabel>
                                    <FormControl>
                                        <Input className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" placeholder="Ej. PRD-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Nombre</FormLabel>
                                    <FormControl>
                                        <Input className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" placeholder="Nombre del producto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="descripcion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-slate-700">Descripción</FormLabel>
                                <FormControl>
                                    <Input className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" placeholder="Breve descripción del producto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="categoriaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Categoría</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11 bg-slate-50/50 focus:ring-primary/20 cursor-pointer">
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl shadow-lg border-slate-100">
                                            {categorias?.map((cat) => (
                                                <SelectItem key={cat.categoriaId} value={cat.categoriaId.toString()} className="cursor-pointer font-medium text-slate-600">
                                                    {cat.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="proveedor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Proveedor</FormLabel>
                                    <FormControl>
                                        <Input className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" placeholder="Nombre del proveedor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Stock Inicial</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-11 bg-slate-50/50 focus-visible:ring-primary/20"
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="precioCompra"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Precio Compra ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-11 bg-slate-50/50 focus-visible:ring-primary/20"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="precioVenta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-slate-700">Precio Venta ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-11 bg-slate-50/50 focus-visible:ring-primary/20"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center mt-auto pt-8 pb-2 gap-5">
                    {onCancel && (
                        <Button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-48 h-11 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <X className="mr-2 h-5 w-5" /> Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-48 h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm transition-colors cursor-pointer"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Guardando..." : initialData ? "Actualizar Producto" : "Crear Producto"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};